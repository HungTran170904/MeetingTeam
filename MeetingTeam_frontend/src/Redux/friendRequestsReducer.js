import { createSlice } from "@reduxjs/toolkit";

const friendRequestsReducer=createSlice({
          name:"friendRequests",
          initialState:null,
          reducers:{
                    loadFriendRequests:(state,action)=>{
                              console.log("Load friend requests", action.payload)
                              return action.payload;
                    },
                    addFriendRequest:(state, action)=>{
                              const newRequest=action.payload;
                              let requestIndex=state.findIndex(request=>request.id==newRequest.id);
                              if(requestIndex==-1) state.push(newRequest);
                              else state[requestIndex]=newRequest;
                    },
                    deleteFriendRequest:(state, action)=>{
                              let requestId=action.payload;
                              return state.filter(request=>request.id!=requestId);
                    } 
          }
})
export const {loadFriendRequests,  addFriendRequest, deleteFriendRequest}=friendRequestsReducer.actions;
export default friendRequestsReducer.reducer;
