package com.HungTran.MeetingTeam.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration
public class CloudinaryConfig {
	@Value("${cloudinary.cloud-name}")
	private String cloudName;
	@Value("${cloudinary.cloud-url}")
	private String cloudUrl;
	@Value("${cloudinary.api-key}")
	private String apiKey;
	@Value("${cloudinary.api-secret}")
	private String apiSecret;
	
	@Bean
	public Cloudinary cloudinary() {
		return new Cloudinary(ObjectUtils.asMap(
			"cloud_name", cloudName,
			"api_key", apiKey,
			"api_secret", apiSecret,
			"secure", true	
			));		
	}
}
