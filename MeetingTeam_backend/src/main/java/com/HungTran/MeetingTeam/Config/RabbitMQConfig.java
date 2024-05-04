package com.HungTran.MeetingTeam.Config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
	@Value("${rabbitmq.queue-name}")
	private String queueName;
	@Value("${rabbitmq.routing-key}")
	private String routingKey;
	@Value("${rabbitmq.exchange-name}")
	private String exchange;
	@Bean
	public Queue queue() {
		return new Queue(queueName);
	}
	@Bean
	public TopicExchange exchange() {
		return new TopicExchange(exchange);
	}
	@Bean
	public Binding binding() {
		return BindingBuilder.bind(queue())
				.to(exchange())
				.with(routingKey);
	}
}
