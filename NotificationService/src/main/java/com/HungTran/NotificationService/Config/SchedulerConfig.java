package com.HungTran.NotificationService.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

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
		Map<String,ScheduledFuture<?>>scheduledTasks=new HashMap();
		return scheduledTasks;
	}
}
