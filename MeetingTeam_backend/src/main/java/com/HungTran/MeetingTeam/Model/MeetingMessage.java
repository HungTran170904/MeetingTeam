package com.HungTran.MeetingTeam.Model;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class MeetingMessage {
	@Id @UuidGenerator
	private String id;
	private String meetingId;
	private LocalDateTime createdAt;
	private String type; //START, END
	private String content;
}
