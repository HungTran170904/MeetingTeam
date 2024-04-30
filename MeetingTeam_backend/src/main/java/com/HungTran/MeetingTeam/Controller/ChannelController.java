package com.HungTran.MeetingTeam.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HungTran.MeetingTeam.DTO.ChannelDTO;
import com.HungTran.MeetingTeam.Model.Channel;
import com.HungTran.MeetingTeam.Service.ChannelService;

@RestController
@RequestMapping("/api/channel")
public class ChannelController {
	@Autowired
	ChannelService channelService;
	@PostMapping("/updateChannel")
	public ResponseEntity<HttpStatus> updateChannel(
			@RequestBody ChannelDTO dto){
		channelService.updateChannel(dto);
		return new ResponseEntity(HttpStatus.OK);
	}
	
	@DeleteMapping("/deleteChannel/{id}")
	public ResponseEntity<HttpStatus> deleteChannel(
			@PathVariable("id") String channelId){
		channelService.deleteChannel(channelId);
		return new ResponseEntity(HttpStatus.OK);
	}
}
