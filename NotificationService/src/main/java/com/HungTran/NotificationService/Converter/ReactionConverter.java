package com.HungTran.NotificationService.Converter;

import com.HungTran.NotificationService.Exception.RequestException;
import com.HungTran.NotificationService.Models.MessageReaction;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class ReactionConverter implements AttributeConverter<List<MessageReaction>, String> {
	private final Logger LOGGER=LoggerFactory.getLogger(ReactionConverter.class);
	private final ObjectMapper objectMapper=new ObjectMapper();
	@Override
	public String convertToDatabaseColumn(List<MessageReaction> attribute) {
		try {	
			String reactionJson="[]";
			if(attribute!=null&&!attribute.isEmpty()) 
				reactionJson=objectMapper.writeValueAsString(attribute);
			return reactionJson;
		} catch (Exception e) {
			throw new RequestException("Unable to convert messageReactions to JSON string");
		}
	}
	
	@Override
	public List<MessageReaction> convertToEntityAttribute(String dbData) {
		try {
			List<MessageReaction> reactions=null;
			if(dbData!=null)
				reactions=objectMapper.readValue(dbData,new TypeReference<List<MessageReaction>>(){});
			return reactions;
		} catch (Exception e) {
			throw new RequestException("Unable to convert JSON string to messageReactions");
		}
	}

}

