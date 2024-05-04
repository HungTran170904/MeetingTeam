package com.HungTran.MeetingTeam.Config;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.GmailScopes;

import lombok.Data;


@Configuration
public class GoogleAPIConfig {
	@Value("${google.credential-file-path}")
	private String credentialFilePath;
	@Value("${google.token-directory}")
	private String tokenDirectory;
	
	public Credential getCredentials(HttpTransport httpTransport,JsonFactory jsonFactory) throws IOException {		
		List<String> scopes=List.of(GmailScopes.GMAIL_SEND);
		// Load client secrets.
		InputStream in = Gmail.class.getResourceAsStream(credentialFilePath);
		if (in == null) {
			throw new FileNotFoundException("Resource not found: "+credentialFilePath);
		}
		GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(jsonFactory, new InputStreamReader(in));

		// Build flow and trigger user authorization request.
		GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(httpTransport,jsonFactory,
				clientSecrets,scopes)
				.setDataStoreFactory(new FileDataStoreFactory(new java.io.File(tokenDirectory)))
				.setAccessType("offline").build();
		LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8888).build();
		Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
		// returns an authorized Credential object.
		return credential;
	}
	@Bean
	public Gmail gmail() throws GeneralSecurityException, IOException {
		HttpTransport httpTransport=GoogleNetHttpTransport.newTrustedTransport();
		JsonFactory jsonFactory=GsonFactory.getDefaultInstance();
		return new Gmail.Builder(httpTransport,jsonFactory, getCredentials(httpTransport,jsonFactory))
				.setApplicationName("Meeting Team Gmail QuickStart").build();
	}
}
