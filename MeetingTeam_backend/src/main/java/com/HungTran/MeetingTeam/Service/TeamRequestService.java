package com.HungTran.MeetingTeam.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Converter.RequestMessageConverter;
import com.HungTran.MeetingTeam.Converter.TeamConverter;
import com.HungTran.MeetingTeam.Converter.TeamMemberConverter;
import com.HungTran.MeetingTeam.DTO.RequestMessageDTO;
import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Model.RequestMessage;
import com.HungTran.MeetingTeam.Model.Team;
import com.HungTran.MeetingTeam.Model.TeamMember;
import com.HungTran.MeetingTeam.Model.User;
import com.HungTran.MeetingTeam.Repository.RequestMessageRepo;
import com.HungTran.MeetingTeam.Repository.TeamMemberRepo;
import com.HungTran.MeetingTeam.Repository.TeamRepo;
import com.HungTran.MeetingTeam.Util.InfoChecking;

@Service
public class TeamRequestService {
	@Autowired
	TeamRepo teamRepo;
	@Autowired
	RequestMessageRepo requestMessRepo;
	@Autowired
	TeamMemberRepo teamMemberRepo;
	@Autowired
	TeamMemberConverter tmConverter;
	@Autowired
	TeamConverter teamConverter;
	@Autowired
	SimpMessagingTemplate messageTemplate;
	@Autowired
	InfoChecking infoChecking;
	@Autowired
	RequestMessageConverter rmConverter;
	public List<RequestMessageDTO> getTeamRequestMessages(String teamId) {
		var messages= requestMessRepo.getTeamRequestMessages(teamId);
		return rmConverter.convertToDTO(messages);
	}
	public List<RequestMessageDTO> getSendedRequestMessages() {
		var messages= requestMessRepo.getSendedRequestMessages(infoChecking.getUserIdFromContext());
		return rmConverter.convertToDTO(messages);
	}
	public void requestToJoinTeam(RequestMessage message) {
		User u=infoChecking.getUserFromContext();
		Team team=teamRepo.findById(message.getTeam().getId()).orElseThrow(()->new RequestException("TeamId does not exists"));
		if(team.getAutoAddMember()) {
			var tm=teamMemberRepo.findByTeamIdAndUserId(team.getId(),u.getId());
			if(tm==null) tm=new TeamMember(u, team,"MEMBER");
			else tm.setRole("MEMBER");
			teamMemberRepo.save(tm);
			messageTemplate.convertAndSend("/queue/"+team.getId()+"/updateMembers",List.of(tmConverter.convertToDTO(tm)));
			team=teamRepo.getTeamWithChannels(team.getId());
			team=teamRepo.getTeamWithChannels(team.getId());
			messageTemplate.convertAndSendToUser(u.getId(),"/addTeam",
					teamConverter.convertTeamToDTO(team,team.getMembers(),team.getChannels()));
		}
		else if(!requestMessRepo.existsBySenderAndTeam(u,message.getTeam())) {	
			message.setSender(u);
			message=requestMessRepo.save(message);
		}
	}
	public void acceptNewMember(String teamId,Integer messageId) {
		String userId=infoChecking.getUserIdFromContext();
		String role=teamMemberRepo.getRoleByUserIdAndTeamId(userId, teamId);
		if(role!=null&&role.equals("LEADER")||role.equals("DEPUTY")) {
			RequestMessage joinMessage=requestMessRepo.findById(messageId).orElseThrow(()->new RequestException("MessageId "+messageId+" not found"));
			var sender=joinMessage.getSender();
			var tm=teamMemberRepo.findByTeamIdAndUserId(teamId,sender.getId());
			if(tm==null) tm=new TeamMember(sender,teamRepo.getById(teamId),"MEMBER");
			else tm.setRole("MEMBER");
			teamMemberRepo.save(tm);
			if(sender.getStatus().equals("ONLINE")) {
				var team=teamRepo.getTeamWithChannels(teamId);
				team=teamRepo.getTeamWithChannels(teamId);
				messageTemplate.convertAndSendToUser(sender.getId(),"/addTeam",
						teamConverter.convertTeamToDTO(team,team.getMembers(),team.getChannels()));
			}
			messageTemplate.convertAndSend("/queue/"+teamId+"/updateMembers",List.of(tmConverter.convertToDTO(tm)));
			requestMessRepo.deleteById(messageId);
		}
		else throw new RequestException("You do not have permission to add a new member!Contact leader or deputies of your team for help!");
	}
	public void deleteTeamRequest(Integer messageId) {
		requestMessRepo.deleteById(messageId);
	}
}
