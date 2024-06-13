package com.HungTran.NotificationService.Util;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;


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
	public LocalDateTime parse(String time) {
		Instant instant = Instant.ofEpochMilli(Long.parseLong(time));
		LocalDateTime localDateTime = instant.atZone(ZoneOffset.UTC).toLocalDateTime();
		return localDateTime;
	}
}
