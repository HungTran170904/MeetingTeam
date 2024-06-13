package com.HungTran.NotificationService.Repository;

import com.HungTran.NotificationService.Models.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingRepo extends JpaRepository<Meeting, Integer> {
    @Query("select m from Meeting m where m.isCanceled=false and m.scheduledTime IS NOT NULL")
    public List<Meeting> findScheduledMeetings();
}
