package com.HungTran.MeetingTeam.Service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQService {
	@Value("rabbitmq.queue-name")
	private String queueName;
	@Value("rabbitmq.routing-key")
	private String routingKey;
	@Value("rabbitmq.exchange-name")
	private String exchange;
	@Autowired
	private RabbitTemplate rabbitTemplate;
	public void sendMessage(String routingKey, String message) {
		rabbitTemplate.convertAndSend(routingKey, message);
	}
}
