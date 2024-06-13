package com.HungTran.MeetingTeam.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.HungTran.MeetingTeam.Repository.ChannelRepo;
import com.HungTran.MeetingTeam.Repository.MeetingRepo;
import com.HungTran.MeetingTeam.Util.DateTimeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.WebSocket.WebSocketEventListener;
import com.google.api.client.googleapis.json.GoogleJsonError;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.util.Base64;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;

@Service
public class GmailService {
	@Autowired
	MeetingRepo meetingRepo;
	@Autowired
	ChannelRepo channelRepo;
	@Autowired
	Gmail gmail;
	@Autowired
	DateTimeUtil dateUtil;
	@Value("${google.from-email-address}")
	private String fromEmailAddress;
	private final Logger LOGGER=LoggerFactory.getLogger(GmailService.class);

	public Message sendEmail(String toEmailAddress,String messageSubject,String bodyText) 
			throws MessagingException, IOException{
		// Encode as MIME message
		Properties props = new Properties();
		Session session = Session.getDefaultInstance(props, null);
		MimeMessage email = new MimeMessage(session);
		email.setFrom(new InternetAddress(fromEmailAddress));
		email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(toEmailAddress));
		email.setSubject(messageSubject);
		email.setText(bodyText);

		// Encode and wrap the MIME message into a gmail message
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();
		email.writeTo(buffer);
		byte[] rawMessageBytes = buffer.toByteArray();
		String encodedEmail = Base64.encodeBase64URLSafeString(rawMessageBytes);
		Message message = new Message();
		message.setRaw(encodedEmail);

		try {
			// Create send message
			message = gmail.users().messages().send("me", message).execute();
			return message;
		} catch (GoogleJsonResponseException e) {
			LOGGER.error(e.getContent());
			throw e;
		}
	}
	public void sendEmailNotification(String meetingId, LocalDateTime time) {
		var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
		String teamName=channelRepo.findTeamNameById(meeting.getChannelId());
		if(meeting.getEmailsReceivedNotification()!=null)
			for(String email: meeting.getEmailsReceivedNotification()) {
				try {
					sendEmail(email,"Upcoming Meeting",
							"Hi guy, there would be a meeting started at "+dateUtil.format(time)+" in team '"+teamName+"'."
									+"\nDon't forget to join in time. Hope you have a good meeting with your teammates");
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
	}
}
