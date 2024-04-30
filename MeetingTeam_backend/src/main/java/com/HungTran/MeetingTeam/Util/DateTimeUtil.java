package com.HungTran.MeetingTeam.Util;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;



@Component
public class DateTimeUtil {
	private DateTimeFormatter formatter=DateTimeFormatter.ofPattern("HH:mm DD/MM/YYYY");
	public Instant convertToInstant(LocalDateTime time) {
		return time.atZone(ZoneId.systemDefault())
				.toInstant();
	}
	public String format(LocalDateTime time) {
		return formatter.format(time);
	}
}
