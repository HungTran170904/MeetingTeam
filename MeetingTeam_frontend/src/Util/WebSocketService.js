import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WEBSOCKET_ENDPOINT } from "./Constraints.js";
import Cookies from "js-cookie";

let sock=null;
let stompClient=null;
let subscriptions = new Map();
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
          subscriptions=new Map();
          console.log('Disconnected');
};
export const subscribeToNewTopic=(dest, newTopic, onMessageReceived)=>{
          const recInterval=setInterval(()=>{
                if (stompClient&&stompClient.connected) {
                  if(subscriptions.has(dest)){
                    subscriptions.get(dest).topics.set(newTopic,onMessageReceived);
                  }
                  else{
                      var callback=stompClient.subscribe(dest, (payload)=>{
                            var socketMessage=JSON.parse(payload.body);
                            var subscription=subscriptions.get(dest);
                            if(subscription&&subscription.topics.has(socketMessage.topic))
                                subscription.topics.get(socketMessage.topic)(socketMessage.payload);
                      });
                      subscriptions.set(dest,{
                        callback, 
                        topics: new Map([[newTopic, onMessageReceived]])
                      })
                  }
                  clearInterval(recInterval);
              }
          },2000);
}
export const unsubscribeTopic=(dest,topic)=>{
   var subscription=subscriptions.get(dest);
   if(subscription) subscription.topics.delete(topic);
}
export const unsubscribeByTeamId=(teamId)=>{
   var subscription=subscriptions.get("/topic/team."+teamId);
   if(subscription){
      subscription.callback.unsubscribe();
      subscriptions.delete("/topic/team."+teamId);
   }
}
export const  sendPublicMessage=(chatMessage)=>{
          stompClient.send(url+"/message",null,JSON.stringify(chatMessage));
}
export const sendPrivateMessage=(chatMessage)=>{
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
