package com.HungTran.NotificationService.Converter;

import com.HungTran.NotificationService.Exception.RequestException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;

import java.util.HashSet;
import java.util.Set;

public class SetStringConverter implements AttributeConverter<Set<String>,String>{
	private final ObjectMapper objectMapper=new ObjectMapper();
	@Override
	public String convertToDatabaseColumn(Set<String> attribute) {
		try {
			String dbData="[]";
			if(attribute!=null&&attribute.size()>0)
				dbData=objectMapper.writeValueAsString(attribute);
			return dbData;
		} catch (Exception e) {
			throw new RequestException("Unable to convert String list to JSON string");
		}
	}

	@Override
	public Set<String> convertToEntityAttribute(String dbData) {
		try {
			Set<String> set=new HashSet();
			if(dbData!=null) {
				set=objectMapper.readValue(dbData,new TypeReference<Set<String>>(){});
			}
			return set;
		} catch (Exception e) {
			throw new RequestException("Unable to convert JSON string to String Set");
		}
	}
	
}
