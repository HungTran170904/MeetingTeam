import {createSlice } from "@reduxjs/toolkit";
const friendsReducer=createSlice({
          name:"friends",
          initialState:[],
          reducers:{
                    loadFriends:(state,action)=>{
                              return action.payload;
                    },
                    addFriendChatMessage:(state,action)=>{
                              const message=action.payload;
                              let friendIndex=state.findIndex(friend=>friend.id===message.recipientId);
                              if(friendIndex>-1){
                                        let friend=state[friendIndex]; 
                                        if(friend.messages){
                                                 let messIndex=friend.messages.findIndex(mess=>mess.id==message.id);
                                                 if(messIndex>-1) friend.messages[messIndex]=message;
                                                 else friend.messages.push(message);
                                        }
                                        else friend.messages=[message];
                                        state[friendIndex]=friend;
                              }
                    },
                    loadMoreMessages:(state, action)=>{
                              const {friendIndex,messages}=action.payload;
                              let friend=state[friendIndex];
                              if(!friend.messages||friend.messages.length==0)
                                        friend.messages=messages;
                              else{
                                        let lastIndex=messages.findIndex(mess=>mess.id==friend.messages[0].id);        
                                        if(lastIndex==-1) lastIndex=messages.length;
                                        let portion=messages.slice(0,lastIndex);
                                        friend.messages=portion.concat(...friend.messages);
                              }
                              state[friendIndex]=friend;
                    },
                    updateFriendStatus:(state, action)=>{
                              const message=action.payload;
                              state=state.map((friend)=>{
                                        if(friend.id==message.senderId){
                                                  friend.status=message.messageType;
                                                  if(message.createdAt) friend.lastActive=new Date(message.createdAt);
                                        }
                                        return friend;
                              })
                    }
          }
})
export const {loadFriends, addFriendChatMessage, updateFriendStatus, loadMoreMessages}=friendsReducer.actions;
export default friendsReducer.reducer;