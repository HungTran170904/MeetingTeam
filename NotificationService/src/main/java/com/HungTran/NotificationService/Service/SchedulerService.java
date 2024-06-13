package com.HungTran.NotificationService.Service;

import com.HungTran.NotificationService.Config.SchedulerConfig;
import com.HungTran.NotificationService.Models.Meeting;
import com.HungTran.NotificationService.Repository.MeetingRepo;
import com.HungTran.NotificationService.Util.DateTimeUtil;
import jakarta.annotation.PostConstruct;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.scheduling.support.SimpleTriggerContext;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ScheduledFuture;

@Service
public class SchedulerService {
    @Autowired
    ThreadPoolTaskScheduler taskScheduler;
    @Autowired
    Map<String, ScheduledFuture<?>> scheduledTasks;
    @Autowired
    RabbitMQService rabbitMQService;
    @Autowired
    MeetingRepo meetingRepo;
    @Autowired
    DateTimeUtil dateUtil;
    private final SimpleTriggerContext triggerContext = new SimpleTriggerContext();
    private final long distance=24*60*60;

    @PostConstruct
    public void loadScheduledTasks() {
        var meetings=meetingRepo.findScheduledMeetings();
        System.out.println("Meetings: "+meetings.size());
        for(var meeting: meetings) {
            addTask(meeting);
        }
    }
    @RabbitListener(queues="${rabbitmq.add-task-queue}")
    public void listenAddTaskMessage(Meeting meeting) {
        addTask(meeting);
    }
    @RabbitListener(queues="${rabbitmq.remove-task-queue}")
    public void listenRemoveTaskMessage(String meetingId) {
        removeTaskByMeetingId(meetingId);
    }
    public void addTask(Meeting meeting) {
        removeTaskByMeetingId(meeting.getId());
        rabbitMQService.sendMessage(meeting.getId(),LocalDateTime.now());
        if(meeting.getScheduledTime()!=null) {
            if(meeting.getScheduledDaysOfWeek()==null||meeting.getScheduledDaysOfWeek().isEmpty()) {
                long diffSec= ChronoUnit.SECONDS.between(LocalDateTime.now(),meeting.getScheduledTime());
                if(diffSec<=distance+5*60)
                    rabbitMQService.sendMessage(meeting.getId(), meeting.getScheduledTime());
                else {
                    var emailTask=new EmailTask(meeting.getId(),meeting.getScheduledTime(),meeting.getEndDate());
                    var startTime=dateUtil.convertToInstant(meeting.getScheduledTime().minusSeconds(distance));
                    var scheduleTask=taskScheduler.schedule(emailTask,startTime);
                    scheduledTasks.put(meeting.getId(),scheduleTask);
                }
            }
            else {
                var startTime=dateUtil.convertToInstant(meeting.getScheduledTime().minusDays(1));
                var beginTask=taskScheduler.schedule(new BeginTask(meeting),startTime);
                scheduledTasks.put(meeting.getId(),beginTask);
            }
        }
    }
    private void removeTaskByMeetingId(String meetingId) {
        var scheduledTask=scheduledTasks.get(meetingId);
        if(scheduledTask!=null) {
            scheduledTask.cancel(true);
            scheduledTasks.remove(meetingId);
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

            emailCron=meetingCron = "0 " + scheduledTime.getMinute() + " " + scheduledTime.getHour() + " ? * ";
            for(int day: daysOfWeek) {
                meetingCron+=(day+",");
                if(day==1) emailCron+="7,";
                else emailCron+=((day-1)+",");
            }
            emailCron=emailCron.substring(0,emailCron.length()-1);
            meetingCron=meetingCron.substring(0,meetingCron.length()-1);
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
            rabbitMQService.sendMessage(meetingId,localTime);
        }
    }
}
