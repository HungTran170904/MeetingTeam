import { useDispatch, useSelector } from "react-redux";
import { addFriendChatMessage, deleteFriend, loadFriends, updateFriendStatus, updateFriends} from "../Redux/friendsReducer.js";
import { connectWebsocket, disconnect, subscribeToNewTopic, unsubscribeByTeamId} from "../Util/WebSocketService.js";
import { getJoinedTeams } from "../API/TeamAPI.js";
import {addTeamChatMessage, deleteMeeting, deleteTeam, loadTeams, removeChannel, updateChannels, updateMeetings, updateMembers, updateTeam} from "../Redux/teamsReducer.js";
import { getFriends, getUserInfo } from "../API/UserAPI.js";
import { loadUser } from "../Redux/userReducer.js";
import { useEffect } from "react";

const DataLoading=({children})=>{
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user);
  const teams=useSelector(state=> state.teams)
  
  useEffect(()=>{
      connectWebsocket();
      return disconnect;
  },[])
  useEffect(()=>{
        if(!user.id) getUserInfo().then(res=>{
          dispatch(loadUser(res.data))
        })
        getFriends().then(res=>{
          dispatch(loadFriends(res.data))
        })
        getJoinedTeams().then(res=>{
            dispatch(loadTeams(res.data))
        })
  },[])
  useEffect(()=>{
    if(user.id){
          let url="/topic/user."+user.id;
          subscribeToNewTopic(url,"/messages",(payload)=>{
              const message=payload;
              const chatMessageTypes=new Set(["TEXT","UNSEND","IMAGE", "VIDEO","AUDIO","FILE"]);
              if(chatMessageTypes.has(message.messageType)){
                  dispatch(addFriendChatMessage(message))
              }
              else if(message.messageType=="OFFLINE"||message.messageType=="ONLINE"){
                  dispatch(updateFriendStatus(message))
              }
              else if(message.messageType=="ERROR") alert(message.content);
          })
          subscribeToNewTopic(url, "/addTeam",(payload)=>{
              const newTeam=payload;
              dispatch(updateTeam(newTeam));
          })
          subscribeToNewTopic(url, "/deleteTeam",(payload)=>{
              const teamId=payload;
              unsubscribeByTeamId(teamId);
              dispatch(deleteTeam(teamId));
          })
          subscribeToNewTopic(url,"/updateFriends",(payload)=>{
              const updatedFriend=payload;
              dispatch(updateFriends(updatedFriend));
          })
          subscribeToNewTopic(url,"/deleteFriend",(payload)=>{
              const friendId=payload;
              dispatch(deleteFriend(friendId));
          })
    }
  },[user])
  function handlePublicMessages(teamId, payload){
      const message=payload;
      const chatMessageTypes=new Set(["TEXT","UNSEND","VOTING","IMAGE", "VIDEO","AUDIO","FILE"]);
      if(chatMessageTypes.has(message.messageType)){
          dispatch(addTeamChatMessage({teamId, message}));
      }
      else if(message.messageType=="ERROR") alert(message.content);
  }
  useEffect(()=>{
      if(teams){
        teams.forEach((team)=>{
            let url="/topic/team."+team.id;
            subscribeToNewTopic(url, "/messages",(payload)=>handlePublicMessages(team.id, payload));
            subscribeToNewTopic(url,"/updateMembers", (payload)=>{
              const members=payload;
              dispatch(updateMembers({teamId: team.id, newMembers: members}))
            })
            subscribeToNewTopic(url,"/updateChannels",(payload)=>{
                const channel=payload;
                dispatch(updateChannels({teamId: team.id, newChannel: channel}))
            })
            subscribeToNewTopic(url, "/removeChannel",(payload)=>{
              const channelId=payload;
              dispatch(removeChannel({teamId: team.id, channelId}))
            })
            subscribeToNewTopic(url, "/updateTeam",(payload)=>{
              const updatedTeam=JSON.parse(payload.body);
              dispatch(updateTeam(updatedTeam));
            })
            subscribeToNewTopic(url, "/updateMeetings", (payload)=>{
              const meeting=payload;
              dispatch(updateMeetings({teamId: team.id, meeting: meeting}))
            })
            subscribeToNewTopic(url, "/deleteMeeting",(payload)=>{
              const data=payload;
              dispatch(deleteMeeting({teamId: team.id, ...data}))
            })
        })
      }
  },[teams])
  return children;
}
export default DataLoading;