package com.HungTran.MeetingTeam.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.HungTran.MeetingTeam.DTO.UserDTO;
import com.HungTran.MeetingTeam.Service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	AuthService authService;
	@PostMapping("/registerUser")
	public ResponseEntity<HttpStatus> registerUser(
			@RequestBody UserDTO dto) throws Exception{
		authService.addUser(dto);
		return new ResponseEntity(HttpStatus.OK);
	}
	@PostMapping("/login")
	public ResponseEntity<UserDTO> login(
			@RequestParam("email") String username,
			@RequestParam("password") String password
			){
		return ResponseEntity.ok(authService.login(username, password));
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
}
