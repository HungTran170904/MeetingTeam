package com.HungTran.MeetingTeam.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.ScheduledThreadPoolExecutor;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Converter.MeetingConverter;
import com.HungTran.MeetingTeam.DTO.MeetingDTO;
import com.HungTran.MeetingTeam.Exception.PermissionException;
import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Model.Meeting;
import com.HungTran.MeetingTeam.Model.MessageReaction;
import com.HungTran.MeetingTeam.Model.Team;
import com.HungTran.MeetingTeam.Model.User;
import com.HungTran.MeetingTeam.Repository.ChannelRepo;
import com.HungTran.MeetingTeam.Repository.MeetingRepo;
import com.HungTran.MeetingTeam.Repository.TeamMemberRepo;
import com.HungTran.MeetingTeam.Repository.TeamRepo;
import com.HungTran.MeetingTeam.Repository.UserRepo;
import com.HungTran.MeetingTeam.Util.InfoChecking;
import com.HungTran.MeetingTeam.Util.ZegoToken;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;





@Service
@Transactional
public class MeetingService {
	@Autowired
	ZegoToken zegoToken;
	@Autowired
	InfoChecking infoChecking;
	@Autowired
	MeetingConverter meetingConverter;
	@Autowired
	SimpMessagingTemplate messageTemplate;
	@Autowired
	ChannelRepo channelRepo;
	@Autowired
	MeetingRepo meetingRepo;
	@Autowired
	TeamMemberRepo tmRepo;
	@Autowired
	UserRepo userRepo;
	@Autowired
	SchedulerService schedulerService;
	
	public String generateToken(String meetingId) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		if(meeting.getIsCanceled()) throw new RequestException("This meeting has been closed");
		User u=infoChecking.getUserFromContext();
		if(tmRepo.existsByChannelIdAndU(u,meeting.getChannelId())==0)
			throw new PermissionException("You do not have permission to get token from this meeting");
		String token= zegoToken.generateToken(infoChecking.getUserIdFromContext(), meetingId);
		System.out.println("Token:"+token);
		return token;
	}
	public List<MeetingDTO> getVideoChannelMeetings(String channelId, Integer receivedMeetingNum){
		int pageSize=infoChecking.findBestPageSize(receivedMeetingNum);
		var meetings= meetingRepo.getMeetingsByChannelId(channelId,PageRequest.of(receivedMeetingNum/pageSize, pageSize));
		Collections.reverse(meetings);
		return meetingConverter.convertToDTOs(meetings);
	}
	public void createMeeting(MeetingDTO dto) {
		Meeting meeting=meetingConverter.convertToMeeting(dto);
		User u=infoChecking.getUserFromContext();
		meeting.setCreatorId(u.getId());
		Team team=channelRepo.findTeamById(meeting.getChannelId());
		if(team==null) throw new RequestException("ChannelId "+meeting.getChannelId()+" is invalid");
		if(!tmRepo.existsByTeamAndU(team, u))
			throw new PermissionException("You do not have permission to create a meeting from this team");
		meeting=meetingRepo.save(meeting);
		if(meeting.getScheduledTime()!=null) {
			schedulerService.addTask(team, meeting);
		}
		messageTemplate.convertAndSend("/queue/"+team.getId()+"/updateMeetings",meetingConverter.convertToDTO(meeting));
	}
	public void updateMeeting(MeetingDTO dto) {
		var meeting=meetingRepo.findById(dto.getId()).orElseThrow(()->new RequestException("MeetingId "+dto.getId()+" does not exists"));
		if(meeting.getIsCanceled()) throw new RequestException("This meeting was canceled");
		if(!infoChecking.getUserIdFromContext().equals(meeting.getCreatorId()))
			throw new PermissionException("You do not have permission to update this meeting");
		if(dto.getScheduledTime()==null) throw new RequestException("Scheduled Time must not be null");
		
		Team team=channelRepo.findTeamById(meeting.getChannelId());
		meeting.setScheduledTime(dto.getScheduledTime());
		meeting.setScheduledDaysOfWeek(dto.getScheduledDaysOfWeek());
		meeting.setEndDate(dto.getEndDate());
		schedulerService.addTask(team,meeting);
		meeting.setTitle(dto.getTitle());
		meeting=meetingRepo.save(meeting);
		messageTemplate.convertAndSend("/queue/"+team.getId()+"/updateMeetings",meetingConverter.convertToDTO(meeting));
	}
	public void reactMeeting(String meetingId, MessageReaction reaction) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		String userId=infoChecking.getUserIdFromContext();
		var reactions=meeting.getReactions();
		if(reactions==null) reactions=new ArrayList();
		int i=0;
		for(;i<reactions.size();i++) {
			if(reaction.getUserId().equals(reactions.get(i).getUserId())) {
				if(reaction.getEmojiCode()==null) reactions.remove(i);
				else reactions.set(i, reaction);
				break;
			}
		}
		if(i==reactions.size()&&reaction.getEmojiCode()!=null) 
			reactions.add(reaction);
		meeting.setReactions(reactions);
		String teamId=channelRepo.findTeamIdById(meeting.getChannelId());
		messageTemplate.convertAndSend("/queue/"+teamId+"/updateMeetings",meetingConverter.convertToDTO(meeting));
		meetingRepo.save(meeting);
	}
	public void cancelMeeting(String meetingId) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		if(!infoChecking.getUserIdFromContext().equals(meeting.getCreatorId()))
			throw new PermissionException("You do not have permission to update this meeting");
		Team team=channelRepo.findTeamById(meeting.getChannelId());
		if(!meeting.getIsCanceled()) {
			schedulerService.removeTask(meeting);
			meeting.setIsCanceled(true);
		}
		else {
			schedulerService.addTask(team, meeting);
			meeting.setIsCanceled(false);
		}
		messageTemplate.convertAndSend("/queue/"+team.getId()+"/updateMeetings",meetingConverter.convertToDTO(meeting));
		meetingRepo.save(meeting);
	}
	public void registerEmailNotification(String meetingId, boolean receiveEmail) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		if(receiveEmail) meeting.getEmailsReceivedNotification().add(infoChecking.getUserFromContext().getEmail());
		else meeting.getEmailsReceivedNotification().remove(infoChecking.getUserFromContext().getEmail());
		meetingRepo.save(meeting);
	}
	public void addToCalendar(String meetingId, boolean isAdded) {
		User u=infoChecking.getUserFromContext();
		if(isAdded) u.getCalendarMeetingIds().add(meetingId);
		else u.getCalendarMeetingIds().remove(meetingId);
		userRepo.save(u);
	}
	public void deleteMeeting(String meetingId) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		if(!infoChecking.getUserIdFromContext().equals(meeting.getCreatorId()))
			throw new PermissionException("You do not have permission to delete this meeting");
		String teamId=channelRepo.findTeamIdById(meeting.getChannelId());
		Map<String, String> map=new HashMap();
		map.put("channelId", meeting.getChannelId());
		map.put("meetingId",meetingId);
		messageTemplate.convertAndSend("/queue/"+teamId+"/deleteMeeting", map);
		schedulerService.removeTask(meeting);
		meetingRepo.deleteById(meetingId);
	}
}
