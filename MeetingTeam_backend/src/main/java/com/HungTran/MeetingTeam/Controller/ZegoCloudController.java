package com.HungTran.MeetingTeam.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/zegocloud")
public class ZegoCloudController {
	@GetMapping("/room_close")
	public ResponseEntity<HttpStatus> roomCloseNotification(){
		//meetingS
		return new ResponseEntity(HttpStatus.OK);
	}
	
}
