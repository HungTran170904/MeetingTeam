package com.HungTran.MeetingTeam.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Repository.MeetingRepo;

@Service
public class ZegoCloudService {
	@Autowired
	MeetingRepo meetingRepo;
	
	public void closeRoomNotification(String roomId) {
		var meeting=meetingRepo.findById(roomId).orElseThrow(()->new RequestException("RoomId "+roomId+" does not exists"));
		
	}
}
