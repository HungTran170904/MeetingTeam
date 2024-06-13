package com.HungTran.MeetingTeam.Controller;

import com.HungTran.MeetingTeam.Security.JwtConfig;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.*;

import com.HungTran.MeetingTeam.DTO.UserDTO;
import com.HungTran.MeetingTeam.Service.AuthService;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Arrays;
import java.util.Map;
// https://github.com/callicoder/spring-boot-react-oauth2-social-login-demo/blob/master/react-social/src/user/oauth2/OAuth2RedirectHandler.js
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthService authService;
	@Autowired
	OAuth2AuthorizedClientService clientService;
	@Autowired
	JwtConfig jwtConfig;
	@PostMapping("/registerUser")
	public ResponseEntity<HttpStatus> registerUser(
			@RequestBody UserDTO dto) throws Exception{
		authService.addUser(dto);
		return new ResponseEntity(HttpStatus.OK);
	}
	@PostMapping("/login")
	public ResponseEntity<UserDTO> login(
			@RequestParam("email") String username,
			@RequestParam("password") String password,
			HttpServletResponse response){
		var pair=authService.login(username, password);
		response.addCookie(pair.getKey());
		return ResponseEntity.ok(pair.getValue());
	}
	@PostMapping("/changePassword")
	public ResponseEntity<HttpStatus> changePassword(
			@RequestParam("email") String email,
			@RequestParam("newPassword") String newPassword,
			@RequestParam("OTPcode") String OTPcode
			){
		authService.changePassword(email, newPassword, OTPcode);
		return new ResponseEntity(HttpStatus.OK);
	}
	@PostMapping("/activateUser")
	public ResponseEntity<HttpStatus> activateUser(
			@RequestParam("email") String email,
			@RequestParam("OTPcode") String OTPcode){
		authService.activateUser(email, OTPcode);
		return new ResponseEntity(HttpStatus.OK);
	}
	@GetMapping("/sendOTPcode")
	public ResponseEntity<HttpStatus> sendOTPcode(
			@RequestParam("email") String email){
		authService.sendOTPcode(email);
		return new ResponseEntity(HttpStatus.OK);
	}
	@GetMapping("/logout")
	public ResponseEntity<HttpStatus> logout(
			HttpServletResponse response){
		Cookie authCookie = new Cookie(jwtConfig.header, null);
		authCookie.setMaxAge(0);
		authCookie.setPath("/");
		response.addCookie(authCookie);
		return new ResponseEntity(HttpStatus.OK);
	}
}
