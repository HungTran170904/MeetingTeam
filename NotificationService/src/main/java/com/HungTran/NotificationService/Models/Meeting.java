package com.HungTran.NotificationService.Models;

import com.HungTran.NotificationService.Converter.IntegerSetConverter;
import com.HungTran.NotificationService.Converter.ReactionConverter;
import com.HungTran.NotificationService.Converter.SetStringConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
public class Meeting {
    @Id
    @UuidGenerator
    private String id;
    private LocalDateTime createdAt;
    private Boolean isCanceled=false;
    private String title;
    @Column(nullable = false)
    private String channelId;
    @Column(nullable=false)
    private String creatorId;
    private LocalDateTime scheduledTime;
    private LocalDateTime endDate;
    private Boolean isActive;
    @Column
    @Convert(converter= IntegerSetConverter.class)
    private Set<Integer> scheduledDaysOfWeek;

    @Column(columnDefinition = "TEXT")
    @Convert(converter= SetStringConverter.class)
    private Set<String> emailsReceivedNotification;

    @Column(columnDefinition = "TEXT")
    @Convert(converter= ReactionConverter.class)
    private List<MessageReaction> reactions;
}
