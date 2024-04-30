package com.HungTran.MeetingTeam.Model;

import java.util.List;
import java.util.Set;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Data
@NoArgsConstructor
public class Team {
	@Id
	@UuidGenerator
	private String id;
	private String teamName;
	private String urlIcon;
	private Boolean autoAddMember=false;
	@OneToMany(mappedBy="team", fetch=FetchType.LAZY)
	private List<TeamMember> members;
	@OneToMany(mappedBy="team", fetch=FetchType.LAZY)
	private List<Channel> channels;
	public Team(String id) {
		this.id=id;
	}
}
