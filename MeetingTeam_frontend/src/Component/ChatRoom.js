import { useState } from "react";
import SockJS from "sockjs-client"
import {over} from "stompjs"
import { MessageForm, UserForm } from "./Forms";
var stompClient=null;
const Authorization="Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZTE3ZTRkZi0xNjM4LTQ3Y2UtYTU1OC1hYmNlNTQxZTFjNWEiLCJpYXQiOjE3MDI4MjAwNDYsImV4cCI6MTcwMzgyMDA0Nn0._6So4avUgXOW8rw1WNBK-oQPYKKLJkgA_AA4SYiIReWsGUL-K4h22JBhKg0OFaMTceUTXpnh-OUZVTWqUW3dwg"
const ChatRoom=()=>{
          const [publicMessages, setPublicMessages]=useState([]);
          const [privateMessages, setPrivateMessages]=useState([]);
          const [userData, setUserData]=useState({
                    id: 0,
                    password: "",
                    username: "",
                    email:"",
                    status: "OFFLINE"
          })
          const connectUser=()=>{
                    const sock=new SockJS("http://localhost:8080/ws?Authorization="+Authorization);
                    stompClient=over(sock);
                    stompClient.connect({}, onConnected, onError);
          }
          const onConnected=()=>{
                    //stompClient.subscribe("/chatroom/public", onPublicMessage);
                    stompClient.subscribe("/user/"+userData.username+"/privateMessage?Authorization="+Authorization, onPrivateMessage);
                    var chatMessage = {
                              senderName:userData.username,
                              status:"JOIN"
                    };
                    stompClient.send("/api/socket/connectUser?Authorization="+Authorization,{}, JSON.stringify(chatMessage));
                    setUserData(prevData=>({...prevData, status:"ONLINE"}));
          }
          const onError=(err)=>{
                    console.log(err);
                    alert(err);
          }
          const onPublicMessage=(payload)=>{
                    const chatMessage=JSON.parse(payload.body);
                    setPublicMessages(prevData=>{
                              const updatedData=[...prevData];
                              updatedData.push(chatMessage);
                              return updatedData;
                    })
          }
          const onPrivateMessage=(payload)=>{
                    const chatMessage=JSON.parse(payload.body);
                    setPrivateMessages(prevData=>{
                              const updatedData=[...prevData];
                              updatedData.push(chatMessage);
                              return updatedData;
                    })
          }
          const sendMessage=(IsPublic,content, receiverName)=>{
                    if(IsPublic){
                              const chatMessage={
                                        content:content,
                                        time: new Date(),
                                        senderName: userData.username,
                                        messageType: "CHAT"
                              }
                              stompClient.send("/api/socket/message", {}, JSON.stringify(chatMessage));
                    }else{
                              if(!receiverName||receiverName.trim()==""){
                                        alert("RecieverName is required");
                                        return;
                              }
                              const chatMessage={
                                        content:content,
                                        time: new Date(),
                                        senderName: userData.username,
                                        messageType: "CHAT",
                                        receiverName:receiverName
                              }
                              stompClient.send("/api/socket/message", {}, JSON.stringify(chatMessage));
                    }
          }
          return(
                    <div>
                              {userData.status=="ONLINE"?<MessageForm publicMessages={publicMessages} privateMessages={privateMessages} sendMessage={sendMessage}/>
                              :<UserForm setUserData={setUserData} connectUser={connectUser}/>}
                    </div>
          )
}
export default ChatRoom;