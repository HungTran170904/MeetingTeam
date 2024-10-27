package com.HungTran.NotificationService.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RabbitMQService {
    @Value("${rabbitmq.notification-queue}")
    private String notificationKey;
    @Value("${rabbitmq.exchange-name}")
    private String exchange;
    private final RabbitTemplate rabbitTemplate;
    private ObjectMapper objectMapper=new ObjectMapper().findAndRegisterModules();

    public void sendMessage(String meetingId, LocalDateTime time) {
        ObjectNode jsonObject = objectMapper.createObjectNode();
        jsonObject.put("meetingId",meetingId);
        jsonObject.put("time", time.toString());
        rabbitTemplate.convertAndSend(exchange, notificationKey, jsonObject);
    }
}
