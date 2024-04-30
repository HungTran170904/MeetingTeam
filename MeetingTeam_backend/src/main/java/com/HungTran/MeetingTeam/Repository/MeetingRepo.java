package com.HungTran.MeetingTeam.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HungTran.MeetingTeam.Model.Meeting;

import jakarta.transaction.Transactional;
@Repository
public interface MeetingRepo extends JpaRepository<Meeting,String>{
	@Query("select m from Meeting m left join fetch m.messages where m.channelId=?1 order by m.createdAt DESC")
	public List<Meeting> getMeetingsByChannelId(String channelId, Pageable pageable);
}
