package com.HungTran.MeetingTeam.Config;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ScheduledFuture;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

@Configuration
public class ScheduledThreadPoolConfig {
	@Bean
	public ThreadPoolTaskScheduler taskScheduler() {
		var taskScheduler=new ThreadPoolTaskScheduler();
		taskScheduler.setPoolSize(5);
		taskScheduler.setThreadNamePrefix("ThreadPoolTaskScheduler");
		return taskScheduler;
	}
	@Bean("emailTasks")
	public Map<String,ScheduledFuture<?>> emailTasks(){
		Map<String,ScheduledFuture<?>> emailTasks=new HashMap();
		return emailTasks;
	}
	@Bean("beginTasks")
	public Map<String,ScheduledFuture<?>> beginTasks(){
		Map<String,ScheduledFuture<?>> beginTasks=new HashMap();
		return beginTasks;
	}
	@Bean("endTasks")
	public Map<String,ScheduledFuture<?>> endTasks(){
		Map<String,ScheduledFuture<?>> endTasks=new HashMap();
		return endTasks;
	}
}
