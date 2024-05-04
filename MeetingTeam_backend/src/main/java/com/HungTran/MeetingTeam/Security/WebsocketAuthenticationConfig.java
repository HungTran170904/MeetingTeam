package com.HungTran.MeetingTeam.Security;

import java.util.List;

import com.HungTran.MeetingTeam.Util.InfoChecking;
import org.aopalliance.intercept.Interceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE)
public class WebsocketAuthenticationConfig implements WebSocketMessageBrokerConfigurer {
	private static Logger LOGGER=LoggerFactory.getLogger(WebsocketAuthenticationConfig.class);
	@Autowired
	JwtProvider jwtProvider;
	@Autowired
	CustomUserDetailsService customUserDetailsService;
	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new ChannelInterceptor() {
			@Override
			public Message<?> preSend(Message<?> message, MessageChannel channel) {
				StompHeaderAccessor accessor=
						MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
				System.out.println("There is a websocket request");
				if(StompCommand.CONNECT.equals(accessor.getCommand())) {
					List<String> token = accessor.getNativeHeader("Authorization");
					LOGGER.debug("Authorization {}", token);

					String userId=jwtProvider.getIdFromToken(token.get(0));
					CustomUserDetails userDetails=customUserDetailsService.loadUserById(userId);
					UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
			                   userDetails.getAuthorities());
					accessor.setUser(authenticationToken);
				}
				return message;
			}
		});
	}
}
