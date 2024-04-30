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
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/wss").setAllowedOriginPatterns("*").withSockJS();
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.setApplicationDestinationPrefixes("/api/socket");
		registry.setUserDestinationPrefix("/user");
		registry.enableSimpleBroker("/queue", "/user");
		/*registry.enableStompBrokerRelay("/queue", "/user")
				.setRelayHost(rabbitmqHost)
				.setRelayPort(rabbitmqPort)
				.setSystemLogin(rabbitmqUsername)
				.setSystemPasscode(rabbitmqPassword);*/
	}
}
