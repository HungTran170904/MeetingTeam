package com.HungTran.MeetingTeam.Security;

import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
	@Autowired
	JwtProvider jwtProvider;
	@Autowired
	CustomUserDetailsService customUserDetailsService;
	@Autowired
	JwtConfig jwtConfig;
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String header=request.getHeader(jwtConfig.header);
		System.out.println("Url is "+request.getRequestURL());
		if(header==null||!header.startsWith(jwtConfig.prefix)) {
			chain.doFilter(request, response);
			return;
		}
		String token=header.substring(jwtConfig.prefix.length(),header.length());
		String id=jwtProvider.getIdFromToken(token);
		CustomUserDetails userDetails=customUserDetailsService.loadUserById(id);
		 UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null,
                   userDetails.getAuthorities());
         SecurityContextHolder.getContext().setAuthentication(authenticationToken);
         chain.doFilter(request, response);
	}

}
