import { useEffect, useState } from "react";
import SendedRequests from "./SendedRequests/SendedRequests.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendRequests } from "../../../API/FriendRequestAPI.js";
import { addFriendRequest, deleteFriendRequest, loadFriendRequests } from "../../../Redux/friendRequestsReducer.js";
import { stompClient, subscribeToNewTopic } from "../../../Util/WebSocketService.js";
import RecievedRequests from "./ReceivedRequests/ReceivedRequests.js";

const FriendRequests=()=>{
          const friendRequests=useSelector(state=>state.friendRequests);
          const user=useSelector(state=>state.user);
          const dispatch=useDispatch();
          const tabTitles=["Received Requests","Sended Requests"];
          const [tab, setTab]=useState("Received Requests");
          useEffect(()=>{
                console.log('Friend Requests', friendRequests)
                if(!friendRequests)
                    getFriendRequests().then(res=>{
                        console.log('Response', res.data)
                        dispatch(loadFriendRequests(res.data));
                })
          },[])
          useEffect(()=>{
            const url="/user/"+user.id;
            if(friendRequests&&stompClient){
                subscribeToNewTopic(url+"/addFriendRequest",(payload)=>{
                    const request=JSON.parse(payload.body);
                    dispatch(addFriendRequest(request));
                })
                subscribeToNewTopic(url+"/deleteFriendRequest",(payload)=>{
                    const requestId=payload.body;
                    dispatch(deleteFriendRequest(requestId));
                })
            }
          },[friendRequests, stompClient])
          return(
                <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-6">
                              <nav className="nav nav-pills nav-justified">
                                        {tabTitles.map((title)=>
                                        <Link key={title} className={"nav-link"+(tab===title?" active":"")} onClick={(e)=> setTab(title)}>{title}</Link>
                                        )}
                              </nav>
                            </div>
                        </div>
                    </div>
                    <div className="request-history">
                        {tab=="Sended Requests"&&<SendedRequests/>}
                        {tab=="Received Requests"&&<RecievedRequests/>}
                    </div>
                </div>
          )
}
export default FriendRequests;