package com.HungTran.MeetingTeam.Service;

import com.HungTran.MeetingTeam.Exception.RequestException;
import com.HungTran.MeetingTeam.Repository.ChannelRepo;
import com.HungTran.MeetingTeam.Repository.MeetingRepo;
import com.HungTran.MeetingTeam.Util.DateTimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class MailService {
    @Autowired
    JavaMailSender mailSender;
    @Autowired
    MeetingRepo meetingRepo;
    @Autowired
    ChannelRepo channelRepo;
    @Autowired
    DateTimeUtil dateUtil;
    @Value("${spring.mail.username}")
    String fromEmailAddress;

    public void sendMail(String to, String subject, String content) {
        try{
            var message = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmailAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true);
            mailSender.send(message);
        }
        catch(Exception e){
            throw new RuntimeException(e);
        }
    }
    public void sendOTPMail(String to,String otpCode){
        sendMail(to,"Meeting Team OTP code",
                "The OTP code is <b>"+otpCode+"</b><br/>Please enter it within 5 minutes");
    }
    public void sendEmailNotification(String meetingId, LocalDateTime time) {
        var meeting=meetingRepo.findById(meetingId).orElseThrow(()->new RequestException("MeetingId "+meetingId+" does not exists"));
        String teamName=channelRepo.findTeamNameById(meeting.getChannelId());
        if(meeting.getEmailsReceivedNotification()!=null)
            for(String email: meeting.getEmailsReceivedNotification()) {
                try {
                    sendMail(email,"Upcoming Meeting",
                    "<div>Hi guy, there would be a meeting started at <b>"+dateUtil.format(time)+"</b> in team '"+teamName+"'.</div>"
                            +"<br/><div>Don't forget to join in time. Hope you have a good meeting with your teammates.</div>");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
    }
}
