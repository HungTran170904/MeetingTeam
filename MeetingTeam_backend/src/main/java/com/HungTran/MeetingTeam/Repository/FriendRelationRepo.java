package com.HungTran.MeetingTeam.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.HungTran.MeetingTeam.Model.FriendRelation;

import jakarta.transaction.Transactional;

@Repository
public interface FriendRelationRepo extends JpaRepository<FriendRelation,String> {
	
}
