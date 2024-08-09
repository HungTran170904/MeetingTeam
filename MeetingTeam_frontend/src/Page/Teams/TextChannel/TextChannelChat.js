import { useDispatch, useSelector } from "react-redux";
import { ReactionDetails, ReactionList } from "../../../Component/Message/Reaction.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MessageType from "../../../Component/Message/MessageType.js";
import MessageDropdown from "../../../Component/Message/MessageDropdown.js";
import EmojiPicker from "emoji-picker-react";
import ReplyAlert from "../../../Component/Message/ReplyAlert.js";
import { getDateTime } from "../../../Util/DateTimeUtil.js";
import { sendPublicMessage } from "../../../Util/WebSocketService.js";
import { getTextChannelMessages, sendFileMessage } from "../../../API/ChatAPI.js";
import { loadMoreMessages, updateTeamChatMessages} from "../../../Redux/teamsReducer.js";
import Avatar from "../../../Component/Avatar/Avartar.js";
import Voting from "../../../Component/Voting/Voting.js";
import VotingModal from "../../../Component/Voting/VotingModal.js";
import VoteDetailModal from "../../../Component/Voting/VoteDetailsModal.js";
import CreateVoteModal from "../../../Component/Voting/CreateVoteModal.js";

const TextChannel=({team, channel, channelInfo})=>{
            const dispatch=useDispatch();
            const user=useSelector(state=>state.user);
            const [textMessage, setTextMessage]=useState("");
            const [replyMessage, setReplyMessage]=useState(null);
            const [showEmojiPicker, setShowEmojiPicker]=useState(false);
            const [reactions, setReactions]=useState(null);
            const [showVoting, setShowVoting]=useState({type:0, message:null});
            useEffect(()=>{
                if(!channel.messages)
                    getTextChannelMessages(0, channel.id).then(res=>{
                        dispatch(loadMoreMessages({channelInfo: channelInfo, messages: res.data}))
                    })
            },[channel])
            function submitMessage(e){
                e.preventDefault();
                const chatMessage={
                    senderId: user.id,
                    channelId: channel.id,
                    content: textMessage,
                    messageType: "TEXT",
                    createdAt: new Date()
                }
                if(replyMessage){
                    chatMessage.parentMessageId=replyMessage.id;
                    setReplyMessage(null);
                }
                sendPublicMessage(chatMessage);
                setTextMessage("");
          }
          function handleAddMessagesButton(e){
                e.preventDefault();
                let limit=channel.messages?channel.messages.length:0;
                getTextChannelMessages(channel.messages.length, channel.id).then(res=>{
                    dispatch(loadMoreMessages({channelInfo: channelInfo, messages: res.data}))
                })
          }
          function handleUpload(e){
                e.preventDefault();
                const file=e.target.files[0];
                const message={
                    senderId: user.id,
                    channelId: channel.id,
                    createdAt: new Date()
                }
                sendFileMessage(message, file);
                e.target.value="";
          }
          function handleEmojiPicker(emojiData, e){
            setTextMessage(prev=>prev+emojiData.emoji);
            }
          return(
          <>
                    {reactions&&<ReactionDetails reactions={reactions} people={team.members.map(member=>member.u)} setShow={setReactions}/>}
                    {showVoting.type==1&&<VotingModal message={showVoting.message} setShow={setShowVoting}/>}
                    {showVoting.type==2&&<VoteDetailModal message={showVoting.message} setShow={setShowVoting} team={team}/>}
                    {showVoting.type==3&&<CreateVoteModal setShow={setShowVoting} channel={channel}/>}
                    <div className="chat-history">
                        <button className="btn btn-success" onClick={(e)=>handleAddMessagesButton(e)}>See more messages</button>
                        <ul className="m-b-0">
                            {channel.messages&&channel.messages.map((message)=>{
                                let parentMessage=null;
                                if(message.parentMessageId){
                                    const index=channel.messages.findIndex(mess=>mess.id==message.parentMessageId);
                                    if(index>=0){
                                        parentMessage={...channel.messages[index]};
                                        parentMessage.sender=team.members.filter(member=>member.u.id==parentMessage.senderId)[0].u;
                                        if(parentMessage.content.length>61) parentMessage.content=parentMessage.content.substring(0,60)+"...";
                                        }
                                    }
                                    if(message.messageType=="VOTING"){
                                        if(message.notShow) return;
                                        let creatorNickName=user.nickName;
                                        if(message.senderId!=user.id){
                                            const sender=team.members.find((member)=>member.u.id==message.senderId).u;
                                            creatorNickName=sender.nickName;
                                        }
                                        return (<Voting key={message.id} message={message} setShow={setShowVoting} creatorNickName={creatorNickName}/>)
                                    }
                                    else if(message.senderId!=user.id){
                                        const sender=team.members.find((member)=>member.u.id==message.senderId).u;
                                            return(
                                                <li className="clearfix" key={message.id}>
                                                    <div className="message-data text-begin">
                                                        <Avatar src={sender.urlIcon}/>
                                                        <span className="message-data-time"><b>{sender.nickName}</b> <small>{getDateTime(message.createdAt)}</small></span>
                                                    </div>
                                                    <div className="message-data d-flex justify-content-begin">
                                                        <div className="message other-message">
                                                                {parentMessage&&
                                                                    <div className="replyMessage">Response to <b>{parentMessage.sender.nickName}</b>: {parentMessage.content}</div>}
                                                                    <MessageType message={message}/>
                                                                    <ReactionList reactions={message.reactions} setReactions={setReactions}/>
                                                            </div>
                                                                 <MessageDropdown message={message} setTextMessage={setTextMessage} setReplyMessage={setReplyMessage}/>
                                                        </div>
                                                    </li>  
                                                )
                                        }
                                else return(
                                        <li className="clearfix" key={message.id}>
                                                <div className="message-data text-end">
                                                    <span className="message-data-time"><small>{getDateTime(message.createdAt)}</small></span>
                                                </div>
                                                <div className="d-flex justify-content-end">
                                                        <MessageDropdown message={message} setTextMessage={setTextMessage} setReplyMessage={setReplyMessage}/>
                                                        <div className="message my-message">
                                                            {parentMessage&&
                                                                    <div className="replyMessage">Response to <b>{parentMessage.sender.nickName}</b>: {parentMessage.content}</div>}
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
                                           <button className="btn btn-outline-warning" onClick={(e)=>setShowEmojiPicker(prev=>!prev)}><i className="fa fa-smile-o"></i></button>
                                            {showEmojiPicker&&<EmojiPicker onEmojiClick={(emojiData, e)=>handleEmojiPicker(emojiData, e)}/>}
                                    </div>
                                    <div className="col-lg-auto">
                                           <button className="btn btn-outline-info" onClick={(e)=>setShowVoting({type:3, message:null})}><i className="fa fa-check-square"></i></button>
                                    </div>
                                </div>
                                {replyMessage&&<ReplyAlert replyMessage={replyMessage} setReplyMessage={setReplyMessage}/>}
                                <form className="input-group mb-0" onSubmit={(e)=>submitMessage(e)}>
                                    <input type="text" className="form-control" placeholder="Enter text here..." onChange={(e)=>setTextMessage(e.target.value)} value={textMessage}/>  
                                    <button className="input-group-text"><i className="fa fa-send"></i></button>                                  
                                </form>
                    </div>
           </>
          )
}
export default TextChannel;