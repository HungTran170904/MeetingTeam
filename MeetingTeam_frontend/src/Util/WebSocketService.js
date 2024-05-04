import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WEBSOCKET_ENDPOINT } from "./Constraints.js";
import Cookies from "js-cookie";

let sock=null;
export let stompClient=null;
export let subscriptions = {};
const url="/api/socket"
export const connectWebsocket = (onConnected) => {
    if(!sock&&!stompClient){
      sock=new SockJS(WEBSOCKET_ENDPOINT)
      stompClient = Stomp.over(sock);
      stompClient.debug=(str)=>console.log(str);
      stompClient.connect({Authorization: Cookies.get("Authorization")}, onConnected, onError);
    }
};

const onError = (error) => {
          console.log('Error:', error);
};

export const disconnect = () => {
          if (stompClient&&stompClient.connected) {
            stompClient.disconnect();
          }
          subscriptions={};
          console.log('Disconnected');
};
export const subscribeToNewTopic=(newTopic, onMessageReceived)=>{
          if (stompClient&&stompClient.connected) {
                  if(!subscriptions[newTopic]){
                    subscriptions[newTopic]=stompClient.subscribe(newTopic, onMessageReceived);
                    console.log("Subscriptions topic", subscriptions);
                  }
          } else {
            console.log("Cannot subscribe to topic "+newTopic);
          }
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
