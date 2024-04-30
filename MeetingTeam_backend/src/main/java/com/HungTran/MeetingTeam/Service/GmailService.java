package com.HungTran.MeetingTeam.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Properties;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

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
	Gmail gmail;
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
			System.out.println("Message id: " + message.getId());
			System.out.println(message.toPrettyString());
			return message;
		} catch (GoogleJsonResponseException e) {
			LOGGER.error(e.getContent());
			throw e;
		}
	}
}
