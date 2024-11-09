import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { WEBSOCKET_ENDPOINT } from "./Constraints.js";

let sock=null;
let stompClient=null;
let subscriptions = new Map();
const timeInterval=3000;
const url="/api/socket"

export const connectWebsocket = () => {
    if(sock==null||sock.readyState === SockJS.CLOSED){
      sock=new SockJS(WEBSOCKET_ENDPOINT);
      stompClient = Stomp.over(sock);
      //stompClient.debug=(str)=>console.log(str);
      stompClient.connect({}, onConnected, onError);
    }
};

const onConnected=()=>{
    console.log("Connect websocket successfully");
}

const onError=(error)=>{
    console.log("Error:", error);
    setTimeout(
      ()=>{
        connectWebsocket();
        console.log("Reconnect websocket");
      }, timeInterval);
}

export const disconnect = () => {
          if (stompClient&&stompClient.connected) {
            stompClient.disconnect();
          }
          sock=null;
          stompClient=null;
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
          },timeInterval);
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

const checkConnection=()=>{
  if(!(stompClient&&stompClient.connected)){
      alert("Connection is unstable. Please check the internet and refresh the page");
  }
  else return true;
}

export const  sendPublicMessage=(chatMessage)=>{
  if(checkConnection())
            stompClient.send(url+"/message",null,JSON.stringify(chatMessage));
}
export const sendPrivateMessage=(chatMessage)=>{
    if(checkConnection())
         stompClient.send(url+"/privateMessage",null,JSON.stringify(chatMessage));
}
export const  reactMessage=(messageId, reaction)=>{
  if(checkConnection())
          stompClient.send(url+"/messageReaction/"+messageId,null,JSON.stringify(reaction));
}
export const unsendMessage=(messageId)=>{
  if(checkConnection())
          stompClient.send(url+"/unsendMessage/"+messageId);
}
export const reactMeeting=(meetingId, reaction)=>{
  if(checkConnection())
          stompClient.send(url+"/meetingReaction/"+meetingId,null, JSON.stringify(reaction));
}
