import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WEBSOCKET_ENDPOINT } from "./Constraints.js";
import Cookies from "js-cookie";

let sock=null;
let stompClient=null;
let subscriptions = {};
const url="/api/socket"
export const connectWebsocket = () => {
      if(sock==null) sock=new SockJS(WEBSOCKET_ENDPOINT);
      if(stompClient==null){
        stompClient = Stomp.over(sock);
        stompClient.debug=(str)=>console.log(str);
        stompClient.connect({Authorization: Cookies.get("Authorization")}, onConnected, onError);
      }
};
const onConnected=()=>{
    console.log("Connect websocket successfully");
}
const onError=()=>{
    console.log("Reconnect websocket");
    setTimeout(connectWebsocket,3000);
}
export const disconnect = () => {
          if (stompClient&&stompClient.connected) {
            stompClient.disconnect();
          }
          subscriptions={};
          console.log('Disconnected');
};
export const subscribeToNewTopic=(newTopic, onMessageReceived)=>{
          const recInterval=setInterval(()=>{
              if (stompClient&&stompClient.connected) {
                if(!subscriptions[newTopic]){
                  subscriptions[newTopic]=stompClient.subscribe(newTopic, onMessageReceived);
                  console.log("Subscriptions topic", subscriptions);
                }
                clearInterval(recInterval);
              }
          },2000);
}
export const unsubscribeTopic=(topic)=>{
  if(subscriptions[topic]){
    subscriptions[topic].unsubscribe();
    delete subscriptions[topic];
  }
}
export const unsubscribeByTeamId=(teamId)=>{
  const topics=Object.keys(subscriptions)
  for(let topic of topics){
          if(topic.indexOf("/queue/"+teamId)>=0) unsubscribeTopic(topic);
      }
}
export const  sendPublicMessage=(chatMessage)=>{
          stompClient.send(url+"/message",null,JSON.stringify(chatMessage));
}
export const sendPrivateMessage=(chatMessage)=>{
          console.log("Subscriptions", subscriptions);
         stompClient.send(url+"/privateMessage",null,JSON.stringify(chatMessage));
  }
export const  reactMessage=(messageId, reaction)=>{
          stompClient.send(url+"/messageReaction/"+messageId,null,JSON.stringify(reaction));
}
export const unsendMessage=(messageId)=>{
          stompClient.send(url+"/unsendMessage/"+messageId);
  }
export const reactMeeting=(meetingId, reaction)=>{
          stompClient.send(url+"/meetingReaction/"+meetingId,null, JSON.stringify(reaction));
}
