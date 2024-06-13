package com.HungTran.MeetingTeam.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Converter.RequestMessageConverter;
import com.HungTran.MeetingTeam.Converter.UserConverter;
import com.HungTran.MeetingTeam.DTO.RequestMessageDTO;
import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Model.FriendRelation;
import com.HungTran.MeetingTeam.Model.RequestMessage;
import com.HungTran.MeetingTeam.Model.User;
import com.HungTran.MeetingTeam.Repository.FriendRelationRepo;
import com.HungTran.MeetingTeam.Repository.RequestMessageRepo;
import com.HungTran.MeetingTeam.Repository.UserRepo;
import com.HungTran.MeetingTeam.Util.InfoChecking;

import jakarta.transaction.Transactional;

@Service
public class FriendRequestService {
	@Autowired
	UserRepo userRepo;
	@Autowired
	FriendRelationRepo frRepo;
	@Autowired
	RequestMessageRepo requestMessRepo;
	@Autowired
	InfoChecking infoChecking;
	@Autowired
	RequestMessageConverter rmConverter;
	@Autowired
	UserConverter userConverter;
	@Autowired
	SimpMessagingTemplate messageTemplate;
	public void friendRequest(String email, String content) {
		User recipient=userRepo.findByEmail(email).orElseThrow(()->new RequestException("Sorry!!Double check that the email is correct"));
		var userId=infoChecking.getUserIdFromContext();
		if(recipient.getId().equals(userId))
			throw new RequestException("Hmn! It seems that the email you enter is your own");
		if(userRepo.havingFriend(userId,recipient.getId())>0)
			throw new RequestException("The owner of this email has already been your friend");
		var message= RequestMessage.builder()
						.sender(infoChecking.getUserFromContext())
						.recipient(recipient)
						.content(content)
						.createdAt(LocalDateTime.now())
						.build();	
		messageTemplate.convertAndSendToUser(userId,"/addFriendRequest",message);
		messageTemplate.convertAndSendToUser(recipient.getId(),"/addFriendRequest",message);
		requestMessRepo.save(message);
	}
	public List<RequestMessageDTO> getFriendRequests() {
		var requests=requestMessRepo.getFriendRequests(infoChecking.getUserIdFromContext());
		return rmConverter.convertToDTO(requests);
	}
	public void deleteFriendRequest(Integer requestId) {
		var request=requestMessRepo.findById(requestId).orElseThrow(()->new RequestException("RequestId "+requestId+" does not exists"));
		requestMessRepo.deleteById(requestId);
		messageTemplate.convertAndSendToUser(request.getSender().getId(),"/deleteFriendRequest",requestId);
		messageTemplate.convertAndSendToUser(request.getRecipient().getId(),"/deleteFriendRequest",requestId);
	}
	@Transactional
	public void acceptFriend(Integer requestId) {
		User u=infoChecking.getUserFromContext();
		RequestMessage message=requestMessRepo.findById(requestId).orElseThrow(()->new RequestException("requestId "+requestId+" not found"));
		if(!u.getId().equals(message.getRecipient().getId()))
			throw new RequestException("If you want to make friend with someone, you need to send friend request to them");
		FriendRelation fr=frRepo.findByUsers(u, message.getSender());
		if(fr==null) fr=new FriendRelation(u,message.getSender(),"FRIEND");
		else fr.setStatus("FRIEND");
		frRepo.save(fr);
		messageTemplate.convertAndSendToUser(message.getSender().getId(),"/updateFriends",userConverter.convertUserToDTO(u));
		messageTemplate.convertAndSendToUser(message.getRecipient().getId(),"/updateFriends",userConverter.convertUserToDTO(message.getSender()));
		requestMessRepo.deleteById(requestId);
		messageTemplate.convertAndSendToUser(message.getSender().getId(),"/deleteFriendRequest",requestId);
		messageTemplate.convertAndSendToUser(message.getRecipient().getId(),"/deleteFriendRequest",requestId);
	}
}
