package com.HungTran.MeetingTeam.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ScheduledFuture;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.scheduling.support.SimpleTriggerContext;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Model.Meeting;
import com.HungTran.MeetingTeam.Model.Team;
import com.HungTran.MeetingTeam.Repository.ChannelRepo;
import com.HungTran.MeetingTeam.Repository.MeetingRepo;
import com.HungTran.MeetingTeam.Util.DateTimeUtil;

import jakarta.annotation.PostConstruct;
import lombok.Builder;

@Service
public class SchedulerService {
	@Value("rabbitmq.queue-name")
	private String queueName;
	@Value("rabbitmq.routing-key")
	private String routingKey;
	@Autowired
	MeetingRepo meetingRepo;
	@Autowired
	ChannelRepo channelRepo;
	@Autowired
	GmailService gmailService;
	@Autowired
	DateTimeUtil dateTime;
	@Autowired
	ThreadPoolTaskScheduler taskScheduler;
	@Autowired
	private RabbitTemplate rabbitTemplate;
	@Autowired
	Map<String,ScheduledFuture<?>> scheduledTasks;
	private final SimpleTriggerContext triggerContext = new SimpleTriggerContext();
	private final long distance=24*60*60;
	
	private void sendEmailNotification(String meetingId,LocalDateTime time) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		String teamName=channelRepo.findTeamNameById(meeting.getChannelId());
		if(meeting.getEmailsReceivedNotification()!=null)
		for(String email: meeting.getEmailsReceivedNotification()) {
			try {
				gmailService.sendEmail(email,"Upcoming Meeting",
					"Hi guy, there would be a meeting started at "+dateTime.format(time)+" in team '"+teamName+"'."
					+"\nDon't forget to join in time. Hope you have a good meeting with your teammates");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
	public void addTask(Meeting meeting) {
		removeTask(meeting);
		if(meeting.getScheduledTime()!=null) {
			if(meeting.getScheduledDaysOfWeek()==null||meeting.getScheduledDaysOfWeek().isEmpty()) {
				long diffSec=ChronoUnit.SECONDS.between(LocalDateTime.now(),meeting.getScheduledTime());
				if(diffSec<=distance+5*60) 
					CompletableFuture.runAsync(()->sendEmailNotification(meeting.getId(),meeting.getScheduledTime()));
				else {
					var emailTask=new EmailTask(meeting.getId(),meeting.getScheduledTime(),meeting.getEndDate());
					var startTime=dateTime.convertToInstant(meeting.getScheduledTime().minusSeconds(distance));
					var scheduleTask=taskScheduler.schedule(emailTask,startTime);
					scheduledTasks.put(meeting.getId(),scheduleTask);
				}
			}
			else {
				var startTime=dateTime.convertToInstant(meeting.getScheduledTime().minusDays(1));
				var beginTask=taskScheduler.schedule(new BeginTask(meeting),startTime);
				scheduledTasks.put(meeting.getId(),beginTask);
			}
		}
	}
	@RabbitListener(queues="${rabbitmq.queue-name}")
	public void listenRabbitMQMessage(String meetingId) {
		removeTaskByMeetingId(meetingId);
	}
	public void removeTask(Meeting meeting) {
		if(meeting.getInstanceName().equals(queueName)) {
			removeTaskByMeetingId(meeting.getId());
		}
		else rabbitTemplate.convertAndSend(routingKey,meeting.getId());
	}
	private void removeTaskByMeetingId(String meetingId) {
		var scheduledTask=scheduledTasks.get(meetingId);
		if(scheduledTask!=null) {
			scheduledTask.cancel(true);
			scheduledTasks.remove(meetingId);
		}
	}
	@PostConstruct
	public void loadScheduledTasks() {
		var meetings=meetingRepo.findMeetingsByInstanceName(queueName);
		for(var meeting: meetings) {
			addTask(meeting);
		}
	}
	class BeginTask implements Runnable{
		private String meetingCron;
		private String emailCron;
		private Meeting meeting;;
		public BeginTask(Meeting meeting) {
			this.meeting=meeting;
			var scheduledTime=meeting.getScheduledTime();
			var daysOfWeek=meeting.getScheduledDaysOfWeek();
			
			String cron = "0 " + scheduledTime.getMinute() + " " + scheduledTime.getHour() + " ? * ";
			String daysOfWeekString=daysOfWeek.toString();
			this.meetingCron=cron+daysOfWeekString.substring(1,daysOfWeekString.length()-1);
			for(int day: daysOfWeek) {
				if(day==1) cron+="7";
				else cron+=(day-1);
				cron+=",";
			}
			cron=cron.substring(0,cron.length()-1);
			this.emailCron=cron;
		}
		@Override
		public void run() {
			System.out.println("Begin Task");
			// the time when the meeting happens
			CronTrigger meetingTrigger=new CronTrigger(meetingCron);
			// the time when the sending email tasks happens. Sending email is 24 hours ahead the meeting
			CronTrigger emailTrigger=new CronTrigger(emailCron);
			
			var emailTask=new EmailTask(meeting.getId(),meetingTrigger,meeting.getEndDate());
			var scheduledTask=taskScheduler.schedule(emailTask,emailTrigger);
			scheduledTasks.remove(meeting.getId());
			scheduledTasks.put(meeting.getId(),scheduledTask);
		}
	}
	class EmailTask implements Runnable{
		private String meetingId;
		private CronTrigger trigger;
		private LocalDateTime localTime;
		private LocalDateTime endTime;
		public EmailTask(String meetingId,CronTrigger trigger,LocalDateTime endTime) {
			this.meetingId=meetingId;
			this.trigger=trigger;
			this.endTime=endTime;
		}
		public EmailTask(String meetingId,LocalDateTime localTime,LocalDateTime endTime) {
			this.meetingId=meetingId;
			this.localTime=localTime;
			this.endTime=endTime;
		}
		@Override
		public void run() {
			System.out.println("Email Task");
			if(endTime!=null&&endTime.isBefore(LocalDateTime.now())) {
				removeTaskByMeetingId(meetingId);
				return;
			}				
			if(trigger!=null) {
				Date time=trigger.nextExecutionTime(triggerContext);
				localTime=time.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
			}
			CompletableFuture.runAsync(()->sendEmailNotification(meetingId,localTime));
		}
	}
}
