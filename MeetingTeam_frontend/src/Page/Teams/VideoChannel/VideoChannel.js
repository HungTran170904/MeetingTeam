import { useEffect, useState } from "react";
import { createMeeting, getVideoChannelMeetings } from "../../../API/MeetingAPI.js";
import { useDispatch, useSelector } from "react-redux";
import { loadChannelMeetings } from "../../../Redux/teamsReducer.js";
import Avatar from "../../../Component/Avatar/Avartar.js";
import {getScheduledTime, getTimeDistance } from "../../../Util/DateTimeUtil.js";
import MeetingDropdown from "./Component/MeetingDropdown.js";
import { ReactionDetails, ReactionList } from "../../../Component/Message/Reaction.js";
import "./VideoChannel.css"
import MeetingModal from "./Component/MeetingModal.js";
import { Link} from "react-router-dom";

const VideoChannel=({team, channel, channelInfo})=>{
          const dispatch=useDispatch();
          const user=useSelector(state=>state.user);
          const [reactions, setReactions]=useState(null);
          const [meetingDTO, setMeetingDTO]=useState(null);
          useEffect(()=>{
                    if(!channel.meetings)
                    getVideoChannelMeetings(channel.id,0).then(res=>{
                              dispatch(loadChannelMeetings({channelInfo, meetings:res.data}))
                    })
                    .catch(err=>alert(err));
          },[channel])
          function handleScheduleButton(e){
            e.preventDefault();
            setMeetingDTO({
               channelId:channel.id,
                title:null,
                scheduledTime:null,
                scheduledEndTime:null,
                scheduledDaysOfWeek:new Set()
            })
          }
          function handleMeetingNowButton(){
                console.log("Create Meeting now");
                createMeeting({
                  channelId:channel.id,
                  title:"new channel meeting",
                  createdAt: new Date(),
                  scheduledTime:null,
                  scheduledEndTime:null,
                  scheduledDaysOfWeek:[]
              }).then(res=>{
                var meetingId=res.data;
                window.location.replace("/videoCall?meetingId="+meetingId);
              }).catch(err=>alert(err));
          }
          function handleAddMeetingsButton(){
                getVideoChannelMeetings(channel.id,channel.meetings.length).then(res=>{
                    dispatch(loadChannelMeetings({channelInfo, meetings:res.data}))
                }).catch(err=>alert(err));
          }
          if(channel.meetings)
          return(
            <>
            {reactions&&<ReactionDetails reactions={reactions} people={team.members.map(member=>member.u)} setShow={setReactions}/>}
            {meetingDTO&&<MeetingModal meeting={meetingDTO} setShow={setMeetingDTO}/>}
          <div className="chat-history">
                    <button class="btn btn-success" onClick={handleAddMeetingsButton}>See more meetings</button>
                    {channel.meetings.map(meeting=>{
                              let owner=null;
                              if(meeting.creatorId==user.id) owner=user;
                              else{
                                    let ownerIndex=team.members.findIndex(member=>member.u.id==meeting.creatorId);
                                    if(ownerIndex>-1) owner=team.members[ownerIndex].u;
                              } 
                              let title=meeting.title?meeting.title:"no title";
                        if(owner)return(
                              <div key={meeting.id} className="card meeting-card">
                                        <div className="card-body">
                                                  <div className="row">
                                                  <div className="col-lg-auto"><Avatar src={owner.urlIcon}/></div>
                                                  <div className="col-lg-6">
                                                            <div className="chat-about">
                                                                      <div className="name">{owner.nickName}</div>
                                                                      <small>{getTimeDistance(owner.createdAt)}</small>
                                                            </div>
                                                  </div>
                                                  <div className="col-lg-4 status">
                                                      {meeting.isActive?<i className="fa fa-circle online"> the meeting is happening</i>:<i className="fa fa-circle offline"> the meeting is offline</i>}
                                                  </div>
                                        </div>
                                        <div className="card mt-3 meeting-detail">
                                                  <div className="card-body">
                                                            <h6 className="card-title"><i className="fa fa-calendar" aria-hidden="true"></i> {meeting.isCanceled?<del>{"Cancel:" +title}</del>:title}</h6>
                                                            <p className="card-text">{getScheduledTime(meeting)}</p>
                                                  </div>
                                        </div>
                                        <div className="mt-3 d-flex justify-content-between align-items-center">
                                                  {!meeting.isCanceled&&<Link to={"/videoCall?meetingId="+meeting.id} className="btn btn-warning">Join</Link>}
                                                  <MeetingDropdown team={team} setMeetingDTO={setMeetingDTO} meeting={meeting}/>
                                                  <ReactionList reactions={meeting.reactions} setReactions={setReactions}/>
                                     </div>
                                 </div>
                              </div>       
                              )
                    })}
                  </div>
                  <div className="chat-message clearfix border-top">
                      <div className="dropdown">
                        <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i className="fa fa-video-camera" aria-hidden="true"></i> Meeting
                        </button>
                        <ul className="dropdown-menu">
                          <li><a className="dropdown-item" onClick={handleMeetingNowButton}><i className="fa fa-pause" aria-hidden="true"></i> Meet now</a></li>
                          <li><a className="dropdown-item" onClick={(e)=>handleScheduleButton(e)}><i className="fa fa-calendar-o" aria-hidden="true"></i> Schedule a meeting</a></li>
                        </ul>
                      </div>
                  </div>
            </> 
          )
}
export default VideoChannel;