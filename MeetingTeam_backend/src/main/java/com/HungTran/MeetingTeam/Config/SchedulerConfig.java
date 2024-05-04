package com.HungTran.MeetingTeam.Config;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

@Configuration
public class SchedulerConfig {
	@Bean
	public ThreadPoolTaskScheduler taskScheduler() {
		var taskScheduler=new ThreadPoolTaskScheduler();
		taskScheduler.setPoolSize(5);
		taskScheduler.setThreadNamePrefix("ThreadPoolTaskScheduler");
		return taskScheduler;
	}
	@Bean
	public Map<String,ScheduledFuture<?>> scheduledTasks(){
		Map<String,ScheduledFuture<?>> emailTasks=new HashMap();
		return emailTasks;
	}
}
