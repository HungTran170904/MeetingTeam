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
	@Autowired @Qualifier("emailTasks")
	Map<String,ScheduledFuture<?>> emailTasks;
	@Autowired @Qualifier("beginTasks")
	Map<String,ScheduledFuture<?>> beginTasks;
	@Autowired @Qualifier("endTasks")
	Map<String,ScheduledFuture<?>> endTasks;
	private final SimpleTriggerContext triggerContext = new SimpleTriggerContext();
	private final long distance=24*60*60*1000;
	
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
	public void addTask(Team team, Meeting meeting) {
		removeTask(meeting);
		if(meeting.getScheduledTime()!=null) {
			if(meeting.getScheduledDaysOfWeek()==null||meeting.getScheduledDaysOfWeek().size()==0) {
				long diffSec=ChronoUnit.MILLIS.between(LocalDateTime.now(),meeting.getScheduledTime());
				if(diffSec<=distance+5*60*1000) sendEmailNotification(meeting.getId(),meeting.getScheduledTime());
				else {
					var emailTask=taskScheduler.
							schedule(
							   new EmailTask(meeting.getId(),meeting.getScheduledTime()),
							   dateTime.convertToInstant(meeting.getScheduledTime().minusSeconds(distance/1000)));
					emailTasks.put(meeting.getId(),emailTask);
				}
			}
			else {
				var beginTask=taskScheduler.schedule(
						new BeginTask(meeting),
						dateTime.convertToInstant(meeting.getScheduledTime().minusDays(1))
						);
				beginTasks.put(meeting.getId(),beginTask);
				if(meeting.getEndDate()!=null) {
					var endTask=taskScheduler.schedule(
							new EndTask(meeting.getId()),
							dateTime.convertToInstant(meeting.getEndDate())
							);
					endTasks.put(meeting.getId(),endTask);
				}
			}
		}
	}
	@RabbitListener(queues="${}")
	public void listenRabbitMQMessage() {
		
	}
	public void removeTask(Meeting meeting) {
		if(meeting.getInstanceName().equals(queueName)) {
			removeTaskByMeetingId(meeting.getId());
		}
		else rabbitTemplate.convertAndSend(routingKey,meeting.getId());
	}
	private void removeTaskByMeetingId(String meetingId) {
		var beginTask=beginTasks.get(meetingId);
		if(beginTask!=null) {
			beginTask.cancel(true);
			beginTasks.remove(meetingId);
		}
		
		var emailTask=emailTasks.get(meetingId);
		if(emailTask!=null) {
			emailTask.cancel(true);
			emailTasks.remove(meetingId);
		}
		
		var endTask=endTasks.get(meetingId);
		if(endTask!=null) {
			endTask.cancel(true);
			endTasks.remove(meetingId);
		}
	}
	class BeginTask implements Runnable{
		private String meetingCron;
		private String emailCron;
		private String meetingId;
		public BeginTask(Meeting meeting) {
			this.meetingId=meeting.getId();
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
			CronTrigger meetingTrigger=new CronTrigger(meetingCron);
			CronTrigger emailTrigger=new CronTrigger(emailCron);
			var futureTask=taskScheduler.schedule(new EmailTask(meetingId,meetingTrigger),emailTrigger);
			emailTasks.put(meetingId,futureTask);
			beginTasks.remove(meetingId);
		}
	}
	class EmailTask implements Runnable{
		private String meetingId;
		private CronTrigger trigger;
		private LocalDateTime localTime;
		public EmailTask(String meetingId,CronTrigger trigger) {
			this.meetingId=meetingId;
			this.trigger=trigger;
		}
		public EmailTask(String meetingId,LocalDateTime localTime) {
			this.meetingId=meetingId;
			this.localTime=localTime;
		}
		@Override
		public void run() {
			System.out.println("Email Task");
			if(trigger!=null) {
				Date time=trigger.nextExecutionTime(triggerContext);
				localTime=time.toInstant().
						atZone(ZoneId.systemDefault()).toLocalDateTime();
			}
			CompletableFuture.runAsync(()->sendEmailNotification(meetingId,localTime));
		}
	}
	class EndTask implements Runnable{
		private String meetingId;
		public EndTask(String meetingId) {
			this.meetingId=meetingId;
		}
		@Override
		public void run() {
			System.out.println("End Task");
			removeTaskByMeetingId(meetingId);
		}
	}
}
