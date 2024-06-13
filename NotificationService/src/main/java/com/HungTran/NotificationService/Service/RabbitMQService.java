package com.HungTran.NotificationService.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class RabbitMQService {
    @Value("${rabbitmq.notification-queue}")
    private String notificationKey;
    @Value("${rabbitmq.exchange-name}")
    private String exchange;
    @Autowired
    private RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper=new ObjectMapper().findAndRegisterModules();

    public void sendMessage(String meetingId, LocalDateTime time) {
        ObjectNode jsonObject = objectMapper.createObjectNode();
        jsonObject.put("meetingId",meetingId);
        jsonObject.put("time", time.toString());
        rabbitTemplate.convertAndSend(exchange, notificationKey, jsonObject);
    }
}
