import { useDispatch, useSelector } from "react-redux";
import { addFriendChatMessage, loadFriends, updateFriendStatus} from "../Redux/friendsReducer.js";
import { connectWebsocket, disconnect, stompClient, subscribeToNewTopic, unsubscribeByTeamId} from "../Util/WebSocketService.js";
import { getJoinedTeams } from "../API/TeamAPI.js";
import {addTeamChatMessage, deleteMeeting, deleteTeam, loadTeams, removeChannel, updateChannels, updateMeetings, updateMembers, updateTeam} from "../Redux/teamsReducer.js";
import { getFriends, getUserInfo } from "../API/UserAPI.js";
import { loadUser } from "../Redux/userReducer.js";
import { useEffect, useState } from "react";

const DataLoading=({children})=>{
  const dispatch=useDispatch();
  const user=useSelector(state=>state.user);
  const teams=useSelector(state=> state.teams)
  const [isConnected, setIsConnected]=useState(false);
  useEffect(()=>{
      return disconnect;
  },[])
  useEffect(()=>{
    const onConnected=()=>{
        setIsConnected(stompClient.connected);
    }
    connectWebsocket(onConnected);
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
    if(user&&isConnected){
          let url="/user/"+user.id
          subscribeToNewTopic(url+"/messages",(payload)=>{
            const message=JSON.parse(payload.body);
            const chatMessageTypes=new Set(["TEXT","UNSEND","IMAGE", "VIDEO","AUDIO","FILE"]);
            if(chatMessageTypes.has(message.messageType)){
                dispatch(addFriendChatMessage(message))
            }
            else if(message.messageType=="OFFLINE"||message.messageType=="ONLINE"){
                dispatch(updateFriendStatus(message))
            }
            else if(message.messageType=="ERROR") alert(message.content);
          })
          subscribeToNewTopic(url+"/addTeam",(payload)=>{
              const newTeam=JSON.parse(payload.body);
              dispatch(updateTeam(newTeam));
          })
          subscribeToNewTopic(url+"/deleteTeam",(payload)=>{
            const teamId=payload.body;
            unsubscribeByTeamId(teamId);
            dispatch(deleteTeam(teamId))
          })
    }
  },[user, isConnected])
  function handlePublicMessages(teamId, payload){
      const message=JSON.parse(payload.body);
      const chatMessageTypes=new Set(["TEXT","UNSEND","IMAGE", "VIDEO","AUDIO","FILE"]);
      if(chatMessageTypes.has(message.messageType)){
          dispatch(addTeamChatMessage({teamId, message}));
      }
      else if(message.messageType=="ERROR") alert(message.content);
  }
  useEffect(()=>{
      if(teams&&isConnected){
        teams.forEach((team, index)=>{
            let url="/queue/"+team.id;
            subscribeToNewTopic(url+"/chat",(payload)=>handlePublicMessages(team.id, payload));
            subscribeToNewTopic(url+"/updateMembers", (payload)=>{
              const members=JSON.parse(payload.body);
              dispatch(updateMembers({teamId: team.id, newMembers: members}))
            })
            subscribeToNewTopic(url+"/updateChannels",(payload)=>{
                const channel=JSON.parse(payload.body);
                dispatch(updateChannels({teamId: team.id, newChannel: channel}))
            })
            subscribeToNewTopic(url+"/removeChannel",(payload)=>{
              const channelId=payload.body;
              dispatch(removeChannel({teamId: team.id, channelId}))
            })
            subscribeToNewTopic(url+"/updateTeam",(payload)=>{
              const updatedTeam=JSON.parse(payload.body);
              dispatch(updateTeam(updatedTeam));
            })
            subscribeToNewTopic(url+"/updateMeetings", (payload)=>{
              const meeting=JSON.parse(payload.body);
              dispatch(updateMeetings({teamId: team.id, meeting: meeting}))
            })
            subscribeToNewTopic(url+"/deleteMeeting",(payload)=>{
              const data=JSON.parse(payload.body);
              dispatch(deleteMeeting({teamId: team.id, ...data}))
            })
        })
      }
  },[teams, isConnected])
  return children;
}
export default DataLoading;