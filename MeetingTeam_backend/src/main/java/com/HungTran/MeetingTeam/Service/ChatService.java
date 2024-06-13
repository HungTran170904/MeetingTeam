package com.HungTran.MeetingTeam.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Exception.MessageException;
import com.HungTran.MeetingTeam.Exception.PermissionException;
import com.HungTran.MeetingTeam.Model.Channel;
import com.HungTran.MeetingTeam.Model.Message;
import com.HungTran.MeetingTeam.Model.MessageReaction;
import com.HungTran.MeetingTeam.Repository.ChannelRepo;
import com.HungTran.MeetingTeam.Repository.MessageRepo;
import com.HungTran.MeetingTeam.Repository.TeamMemberRepo;
import com.HungTran.MeetingTeam.Repository.TeamRepo;
import com.HungTran.MeetingTeam.Repository.UserRepo;
import com.HungTran.MeetingTeam.Util.InfoChecking;

@Service
public class ChatService {
	@Autowired
	MessageRepo messageRepo;
	@Autowired
	TeamRepo teamRepo;
	@Autowired
	UserRepo userRepo;
	@Autowired
	ChannelRepo channelRepo;
	@Autowired
	TeamMemberRepo teamMemberRepo;
	@Autowired
	SimpMessagingTemplate messageTemplate;
	@Autowired
	CloudinaryService cloudinaryService;
	UserService userService;
	@Autowired
	InfoChecking infoChecking;

	public void broadcastMessage(Message message) {
		if(message.getRecipientId()!=null) {
			messageTemplate.convertAndSendToUser(message.getSenderId(),"/messages",message);
			messageTemplate.convertAndSendToUser(message.getRecipientId(),"/messages",message);
		}
		else if(message.getChannelId()!=null) {
			String teamId=channelRepo.findTeamIdById(message.getChannelId());
			messageTemplate.convertAndSend("/queue/"+teamId+"/chat",message);
		}
	}
	public void receivePublicChatMessage(Message chatMessage, MultipartFile file) {
		String teamId=channelRepo.findTeamIdById(chatMessage.getChannelId());
		chatMessage.setSenderId(infoChecking.getUserIdFromContext());
		if(file!=null) {
			chatMessage.setContent(cloudinaryService.uploadFile(file,infoChecking.getUserIdFromContext(),null));
			String type=file.getContentType().split("/")[0];
			if(type.equals("image")) chatMessage.setMessageType("IMAGE");
			else if(type.equals("video")) chatMessage.setMessageType("VIDEO");
			else if(type.equals("audio")) chatMessage.setMessageType("AUDIO");
			else chatMessage.setMessageType("FILE");
			chatMessage.setFileName(file.getOriginalFilename());
		}
		var savedMess=messageRepo.save(chatMessage);
		messageTemplate.convertAndSend("/queue/"+teamId+"/chat",savedMess);
	}
	
	public void receivePrivateChatMessage(Message chatMessage, MultipartFile file) {
		if(chatMessage.getRecipientId()==null) 
			throw new MessageException("RecipientId is not null");
		chatMessage.setSenderId(infoChecking.getUserIdFromContext());
		if(file!=null) {
			chatMessage.setContent(cloudinaryService.uploadFile(file,infoChecking.getUserIdFromContext(),null));
			String type=file.getContentType().split("/")[0];
			if(type.equals("image")) chatMessage.setMessageType("IMAGE");
			else if(type.equals("video")) chatMessage.setMessageType("VIDEO");
			else if(type.equals("audio")) chatMessage.setMessageType("AUDIO");
			else chatMessage.setMessageType("FILE");
			chatMessage.setFileName(file.getOriginalFilename());
		}
		var savedMess=messageRepo.save(chatMessage);
		messageTemplate.convertAndSendToUser(savedMess.getRecipientId(),"/messages", savedMess);
		messageTemplate.convertAndSendToUser(savedMess.getSenderId(),"/messages", savedMess);
	}
	
	public List<Message> getTextChannelMessages(Integer receivedMessageNum, String channelId) {
		Channel channel=channelRepo.findById(channelId).orElseThrow(()->new RequestException("ChannelId "+channelId+" does not exist"));
		if(!teamMemberRepo.existsByTeamAndU(channel.getTeam(),infoChecking.getUserFromContext()))
			throw new PermissionException("You do not have permission to read messages from the required conversation");
		int pageSize=infoChecking.findBestPageSize(receivedMessageNum);
		PageRequest pagination=PageRequest.of(receivedMessageNum/pageSize,pageSize);
		var result= messageRepo.getMessagesByChannelId(channelId, pagination);
		Collections.reverse(result);
		return result;
	}
	
	public List<Message> getPrivateMessages(Integer receivedMessageNum, String friendId){
		if(userRepo.havingFriend(infoChecking.getUserIdFromContext(),friendId)==0)
			throw new PermissionException("You do not have permission to read messages from the given person");
		int pageSize=infoChecking.findBestPageSize(receivedMessageNum);
		PageRequest pagination=PageRequest.of(receivedMessageNum/pageSize,pageSize);
		var result= messageRepo.getPrivateMessages(infoChecking.getUserIdFromContext(),friendId, pagination);
		Collections.reverse(result);
		return result;
	}
	
	public void reactMessage(Integer messageId, MessageReaction reaction) {
		String userId=infoChecking.getUserIdFromContext();
		var message=messageRepo.findById(messageId).orElseThrow(()-> new MessageException(("MessageId "+messageId+" not found")));
		var reactions=message.getReactions();
		if(reactions==null) reactions=new ArrayList();
		int i=0;
		for(;i<reactions.size(); i++) {
			if(reactions.get(i).getUserId().equals(userId)) {
				if(reaction.getEmojiCode()==null) reactions.remove(i);
				else reactions.set(i, reaction);
				break;
			}
		}
		if(i==reactions.size()&&reaction.getEmojiCode()!=null) 
			reactions.add(reaction);
		broadcastMessage(message);
		message.setReactions(reactions);
		messageRepo.save(message);
	}
	
	public void unsendMessage(Integer messageId) {
		Message message=messageRepo.findById(messageId)
				.orElseThrow(()->new RequestException("Message id "+messageId+" not found!"));
		String type=message.getMessageType();
		if(type=="IMAGE"||type=="AUDIO"||type=="IMAGE"||type=="FILE") {
			cloudinaryService.deleteFile(message.getContent());
		}
		message.setMessageType("UNSEND");
		message.setContent(null);
		message.setReactions(null);
		message.setVoting(null);
		broadcastMessage(message);
		messageRepo.save(message);
	}
	public void deleteMessagesByChannelId(String channelId) {
		for(Message message: messageRepo.getFileMessagesByChannelId(channelId)) {
			cloudinaryService.deleteFile(message.getContent());
		}
		messageRepo.deleteByChannelId(channelId);
	}
}