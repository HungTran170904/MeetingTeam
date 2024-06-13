import { useDispatch, useSelector } from "react-redux";
import { getDateTime, getTimeDistance } from "../../Util/DateTimeUtil.js";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import MessageDropdown from "../../Component/Message/MessageDropdown.js";

import ReplyAlert from "../../Component/Message/ReplyAlert.js";
import { sendPrivateMessage } from "../../Util/WebSocketService.js";

import { getPrivateMessages, sendPrivateFileMessage } from "../../API/ChatAPI.js";
import { loadMoreMessages } from "../../Redux/friendsReducer.js";
import EmojiPicker from "emoji-picker-react";
import { ReactionDetails, ReactionList} from "../../Component/Message/Reaction.js";
import MessageType from "../../Component/Message/MessageType.js";
import Avatar from "../../Component/Avatar/Avartar.js";
import Voting from "../../Component/Voting/Voting.js";
import UnfriendModal from "./UnfriendModal.js";


const FriendChat=({friend, indexChatFriend})=>{
          const dispatch=useDispatch();
          const user=useSelector(state=>state.user);
          const [textMessage, setTextMessage]=useState("");
          const [replyMessage, setReplyMessage]=useState(null);
          const [showEmojiPicker, setShowEmojiPicker]=useState(false);
          const [reactions, setReactions]=useState(null);
          const [showUnfriend, setShowUnfriend]=useState(false);
          const target = useRef(null);
          useEffect(()=>{
                if(!friend.messages){
                    getPrivateMessages(0, friend.id).then(res=>{
                        dispatch(loadMoreMessages({messages: res.data,friendIndex: indexChatFriend}))
                    })
                }
          },[])
          function submitMessage(e){
                e.preventDefault();
                if(textMessage=="") return;
                const chatMessage={
                    senderId: user.id,
                    recipientId: friend.id,
                    content: textMessage,
                    messageType: "TEXT",
                    createdAt: new Date(),
                }
                if(replyMessage){
                    chatMessage.parentMessageId=replyMessage.id;
                    setReplyMessage(null);
                }
                sendPrivateMessage(chatMessage);
                setTextMessage("");
          }
          function handleAddMessagesButton(e){
               e.preventDefault();
               let limit=friend.messages?friend.messages.length:0;
                getPrivateMessages(limit, friend.id).then(res=>{
                        dispatch(loadMoreMessages({messages: res.data, friendIndex: indexChatFriend}))
                })
          }
          function handleUpload(e){
                const file=e.target.files[0];
                const message={
                    senderId: user.id,
                    recipientId: friend.id,
                    createdAt: new Date()
                }
                sendPrivateFileMessage(message, file);
          }
          function handleEmojiPicker(emojiData, e){
                setTextMessage(prev=>prev+emojiData.emoji);
          }
          return(
            <>
                {reactions&&<ReactionDetails reactions={reactions} people={[user, friend]} setShow={setReactions}/>}
                {showUnfriend&&<UnfriendModal friend={friend} setShow={setShowUnfriend}/>}
                <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-6">
                                <Avatar src={friend.urlIcon}/>
                                <div className="chat-about">
                                    <h6 className="m-b-0">{friend.nickName}</h6>
                                    <small>Last seen: {getTimeDistance(friend.lastActive)}</small>
                                </div>
                            </div>
                            <div className="col-lg-6 hidden-sm text-end">
                                <Link to="#" onClick={()=>setShowUnfriend(true)} className="btn btn-outline-secondary"><i className="fa fa-hand-paper-o" aria-hidden="true"></i></Link>
                                <Link to="#" className="btn btn-outline-primary"><i className="fa fa-phone"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="chat-history">
                        <button className="btn btn-success" onClick={(e)=>handleAddMessagesButton(e)}>See more messages</button>
                        <ul className="m-b-0">
                            {friend.messages&&friend.messages.map((message)=>{
                                let parentMessage=null;
                                if(message.parentMessageId){
                                    const index=friend.messages.findIndex(mess=>mess.id==message.parentMessageId);
                                    if(index>=0){
                                        parentMessage={...friend.messages[index]};
                                        if(parentMessage.content.length>61) parentMessage.content=parentMessage.content.substring(0,60)+"...";
                                    }
                                }
                                if(message.senderId===friend.id)
                                        return(
                                            <li className="clearfix" key={message.id}>
                                                <div className="message-data text-begin">
                                                    <Avatar src={friend.urlIcon}/>
                                                    <span className="message-data-time">{getDateTime(message.createdAt)}</span>
                                                </div>
                                                <div className="message-data d-flex justify-content-begin">
                                                        <div className="message other-message">
                                                                {parentMessage&&
                                                                <div className="replyMessage">Response to <b>{friend.nickName}</b>: {parentMessage.content}</div>}
                                                                <MessageType message={message}/>
                                                                <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                         </div>
                                                         <MessageDropdown message={message} setTextMessage={setTextMessage} setReplyMessage={setReplyMessage}/>
                                                    </div>
                                            </li>  
                                        )
                                    else return(
                                        <li className="clearfix" key={message.id}>
                                                <div className="message-data text-end">
                                                    <span className="message-data-time">{getDateTime(message.createdAt)}</span>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                        <MessageDropdown message={message} setTextMessage={setTextMessage} setReplyMessage={setReplyMessage}/>
                                                        <div className="message my-message">
                                                        {parentMessage&&
                                                                <div className="replyMessage">Response to <b>{user.nickName}</b>: {parentMessage.content}</div>}
                                                                <MessageType message={message}/>
                                                                <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                         </div>
                                                </div>
                                            </li>
                                    )
                            })}                           
                        </ul>
                    </div>
                    <div className="chat-message clearfix border-top">
                        <div className="row justify-content-begin" style={{marginBottom:"5px"}}>
                            <div className="col-lg-auto">
                                <input type="file" id="fileUpload" onChange={(e)=>handleUpload(e)}  style={{display: 'none'}}/>
                                <button className="btn btn-outline-secondary" onClick={()=>document.getElementById("fileUpload").click()}><i className="fa fa-paperclip"></i></button>
                            </div> 
                            <div className="col-lg-auto">
                                   <button ref={target} className="btn btn-outline-warning" onClick={(e)=>setShowEmojiPicker(prev=>!prev)}><i className="fa fa-smile-o"></i></button>
                                    {showEmojiPicker&&<EmojiPicker onEmojiClick={(emojiData, e)=>handleEmojiPicker(emojiData, e)}/>}
                            </div>
                        </div>
                        {replyMessage&&<ReplyAlert replyMessage={replyMessage} setReplyMessage={setReplyMessage}/>}
                        <form className="input-group mb-0" onSubmit={(e)=>submitMessage(e)}>
                            <input type="text" className="form-control" placeholder="Enter text here..." onChange={(e)=>setTextMessage(e.target.value)} value={textMessage}/>  
                            <button className="input-group-text"><i className="fa fa-send"></i></button>                                  
                        </form>
                    </div>
                </div>
            </>
          )
}
export default FriendChat;