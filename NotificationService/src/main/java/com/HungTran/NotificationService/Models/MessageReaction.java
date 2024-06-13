package com.HungTran.NotificationService.Models;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageReaction {
	private String userId;
	private String emojiCode;
}
