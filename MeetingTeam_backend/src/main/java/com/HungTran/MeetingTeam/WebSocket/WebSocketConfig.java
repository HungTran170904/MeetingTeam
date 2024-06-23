package com.HungTran.MeetingTeam.WebSocket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
	@Value("${stomp.rabbitmq.host}")
	private String rabbitqmHost;
	@Value("${stomp.rabbitmq.port}")
	private int rabbitmqPort;
	@Value("${stomp.rabbitmq.username}")
	private String rabbitmqUsername;
	@Value("${stomp.rabbitmq.password}")
	private String rabbitmqPassword;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/wss").setAllowedOriginPatterns("*").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.setApplicationDestinationPrefixes("/api/socket");
		registry.setUserDestinationPrefix("/user");
		registry.enableStompBrokerRelay("/queue","/topic")
				.setRelayHost(rabbitqmHost)
				.setRelayPort(rabbitmqPort)
				.setClientLogin(rabbitmqUsername)
				.setClientPasscode(rabbitmqPassword);
	}
}
