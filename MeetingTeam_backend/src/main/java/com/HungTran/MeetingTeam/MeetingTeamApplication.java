package com.HungTran.MeetingTeam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MeetingTeamApplication {
	public static void main(String[] args) {
		SpringApplication.run(MeetingTeamApplication.class, args);
	}
}
/*
 * Subscription:
 * 	/queue/teamId/chat
 * /queue/teamId/updateTeam
 * /queue/teamId/updateChannels
 * /queue/teamId/updateMembers
 * /queue/teamId/removeChannel
 * /queue/teamId/updateMeetings
 * /queue/teamId/deleteMeeting
 * 	/user/userId/messages
 * /user/userId/friendRequest
 * /user/userId/deleteFriend
 * /user/userId/addFriendRequest
 * /user/userId/deleteFriendRequest
 */
//https://github.com/zainbinfurqan/Zego-cloud-test-flight/blob/configure-server/src/Pages/Video-Calling/index.js
//https://docs.zegocloud.com/article/15442
//https://stackoverflow.com/questions/49533543/spring-and-scheduled-tasks-on-multiple-instances
//https://stackoverflow.com/questions/28552033/disconnect-client-session-from-spring-websocket-stomp-server
//https://github.com/Benkoff/WebRTC-SS/blob/master/src/main/java/io/github/benkoff/webrtcss/domain/Room.java
//https://github.com/anhtienzz123/zelo-app-chat/blob/main
//https://stackoverflow.com/questions/25486889/websocket-stomp-over-sockjs-http-custom-headers
//https://www.reddit.com/r/WebRTC/comments/mx8fd6/how_to_build_a_simple_sfu_server/?rdt=46456
//https://github.com/ali-bouali/one-to-one-chat-spring-boot-web-socket
//https://github.com/ali-bouali/spring-boot-websocket-chat-app/blob/main/src/main/java/com/alibou/websocket/config/WebSocketEventListener.java
//https://www.baeldung.com/spring-security-two-factor-authentication-with-soft-token
//https://www.section.io/engineering-education/building-a-video-streaming-app-with-spring/