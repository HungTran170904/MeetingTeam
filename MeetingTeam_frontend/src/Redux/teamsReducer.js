import { createSlice } from "@reduxjs/toolkit";

const teamsReducer=createSlice({
          name: "teams",
          initialState:[],
          reducers:{
                    loadTeams:(state, action)=>{
                              return action.payload;
                    },
                    addTeamChatMessage:(state,action)=>{
                              const {teamId, message}=action.payload;
                              const teamIndex=state.findIndex((team)=>team.id==teamId);
                              if(teamIndex>-1){
                                        let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==message.channelId);
                                        if(channelIndex>-1){
                                                  let channel={...state[teamIndex].channels[channelIndex]};
                                                  if(channel.messages){
                                                            let messIndex=channel.messages.findIndex(mess=>mess.id==message.id);
                                                            if(messIndex>-1){
                                                                      if(message.messageType=="VOTING"){
                                                                                channel.messages=channel.messages.filter(mess=>mess.id!=message.id);
                                                                                channel.messages.push(message);
                                                                      }                                                         
                                                                      else channel.messages[messIndex]=message;
                                                            } 
                                                            else channel.messages.push(message);
                                                  }
                                                  else channel.messages=[message];
                                                  state[teamIndex].channels[channelIndex]=channel;
                                        }
                              }                       
                    },
                    loadMoreMessages:(state, action)=>{
                              const {channelInfo,messages}=action.payload;
                              let channel=state[channelInfo.teamIndex].channels[channelInfo.channelIndex];
                              if(!channel.messages||channel.messages.length==0)
                                        channel.messages=messages;
                              else{
                                        let lastIndex=messages.findIndex(mess=>mess.id==channel.messages[0].id);        
                                        if(lastIndex==-1) lastIndex=messages.length;
                                        let portion=messages.slice(0,lastIndex);
                                        channel.messages=portion.concat(...channel.messages);
                              }
                              state[channelInfo.teamIndex].channels[channelInfo.channelIndex]=channel;
                    },
                    loadChannelMeetings:(state, action)=>{
                              const {channelInfo, meetings}=action.payload;
                              for(let i=0;i<meetings.length;i++){
                                        meetings[i].scheduledDaysOfWeek=new Set(meetings[i].scheduledDaysOfWeek||[]);
                                        meetings[i].emailsReceivedNotification=new Set(meetings[i].emailsReceivedNotification||[])
                              }
                              let channel=state[channelInfo.teamIndex].channels[channelInfo.channelIndex];
                              if(!channel.meetings||channel.meetings.length==0)
                                        channel.meetings=meetings;
                              else{
                                        let lastIndex=meetings.findIndex(meeting=>meeting.id==channel.meetings[0].id);        
                                        if(lastIndex==-1) lastIndex=meetings.length;
                                        let portion=meetings.slice(0,lastIndex);
                                        channel.meetings=portion.concat(...channel.meetings);
                              }
                              state[channelInfo.teamIndex].channels[channelInfo.channelIndex]=channel;
                              return state;
                    },
                    updateMeetings:(state, action)=>{
                              let {teamId, meeting}=action.payload;
                              meeting.scheduledDaysOfWeek=new Set(meeting.scheduledDaysOfWeek||[]);
                              meeting.emailsReceivedNotification=new Set(meeting.emailsReceivedNotification||[])
                              let teamIndex=state.findIndex(team=>team.id==teamId);
                              if(teamIndex>-1){
                                        let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==meeting.channelId);
                                        if(channelIndex>-1){
                                                  const channel={...state[teamIndex].channels[channelIndex]};
                                                  if(channel.meetings){
                                                            let meetIndex=channel.meetings.findIndex(m=>m.id==meeting.id);
                                                            if(meetIndex>-1) channel.meetings[meetIndex]=meeting;
                                                            else channel.meetings.push(meeting);
                                                  }
                                                  else channel.meetings=[meeting]
                                                  state[teamIndex].channels[channelIndex]=channel;
                                        }
                              }
                    },
                    deleteMeeting:(state, action)=>{
                              const {teamId, channelId, meetingId}=action.payload;
                              let teamIndex=state.findIndex(team=>team.id==teamId);
                              if(teamIndex>-1){
                                        let team={...state[teamIndex]};
                                        let channelIndex=team.channels.findIndex(channel=>channel.id==channelId);
                                        team.channels[channelIndex].meetings=team.channels[channelIndex].meetings.filter(meeting=>meeting.id!=meetingId);
                                        state[teamIndex]=team;
                              }
                    },
                    updateTeam:(state, action)=>{
                              const updatedTeam=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==updatedTeam.id);
                              if(teamIndex==-1) state.push(updatedTeam);
                              else state[teamIndex]={...state[teamIndex], teamName:updatedTeam.teamName, urlIcon: updatedTeam.urlIcon, autoAddMember: updatedTeam.autoAddMember}
                    },
                    deleteTeam:(state, action)=>{
                              const teamId=action.payload;
                              return state.filter(team=>team.id!==teamId);
                    },
                    updateMembers:(state, action)=>{
                              const {teamId,newMembers}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              const members=state[teamIndex].members;
                              newMembers.forEach(newMember=> {
                                        const memberIndex=members.findIndex(member=>member.u.id==newMember.u.id);
                                        if(memberIndex>=0) members[memberIndex]=newMember;
                                        else members.push(newMember);
                              });
                              state[teamIndex].members=members;
                    },
                    updateChannels:(state, action)=>{
                              const {teamId, newChannel}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              let channelIndex=state[teamIndex].channels.findIndex(channel=>channel.id==newChannel.id);
                              if(channelIndex>=0) state[teamIndex].channels[channelIndex]=newChannel;
                              else state[teamIndex].channels.push(newChannel);
                    },
                    removeChannel:(state, action)=>{
                              const {teamId, channelId}=action.payload;
                              const teamIndex=state.findIndex(team=>team.id==teamId);
                              state[teamIndex].channels=state[teamIndex].channels.filter(channel=>channel.id!=channelId);
                    }
          }
})
export const {loadTeams, addTeamChatMessage, loadMoreMessages,
                    loadChannelMeetings, updateMeetings,deleteMeeting,
           updateMembers, updateChannels, removeChannel, updateTeam, deleteTeam} =teamsReducer.actions;
export default teamsReducer.reducer;