import { useState } from "react";

export const MessageForm=({publicMessages, privateMessages,sendMessage})=>{
          const[content, setContent]=useState("");
          const[receiverName, setReceiverName]=useState("");
          const[isPrivate, setIsPrivate]=useState(false);
          return(
                    <div className="container">
                              <div className="row mb-3 border border-primary">
                                        <h5>Public Messages</h5>
                                        <ul>
                                                  {publicMessages.map((data, index)=>(
                                                            <li className="h6" key={index}>
                                                                      Time: {data.time}<br/>
                                                                      {data.senderName}:{data.content}
                                                            </li>
                                                  ))}
                                        </ul>
                              </div>
                              <div className="row mb-3 border border-primary">
                                        <h5>Private Messages</h5>
                                        <ul>
                                                  {privateMessages.map((data, index)=>(
                                                            <li className="h6" key={index}>
                                                                      Time: {data.time}<br/>
                                                                      {data.senderName}:{data.content}
                                                            </li>
                                                  ))}
                                        </ul>
                              </div>
                              <div className="row mb-3">
                                        <label htmlFor="InputMess">Enter your message:</label>
                                        <textarea rows="3" id="InputMess" onChange={(e)=>setContent(e.target.value)}></textarea>
                              </div>
                              <select onChange={(e)=>setIsPrivate(e.target.value=="PrivateMessage")}>
                                        <option value="PublicMessage">Public Message</option>
                                        <option value="PrivateMessage">Private Message</option>
                              </select>
                              {isPrivate&&<div className="row mb-3">
                                        <label htmlFor="ReceiverUsername">Enter your receicer's username:</label>
                                        <input type="username"  id="ReceiverUsername" onChange={(e)=>setReceiverName(e.target.value)}></input>
                              </div>}
                              <button onClick={()=>sendMessage(!isPrivate, content, receiverName)}>Send</button>
                    </div>
          )
}
export const UserForm=({connectUser, setUserData})=>{
          function handleChange(e){
                    setUserData(prevData=>{
                              return {...prevData, username: e.target.value}
                    })
          }
          return(
                    <div className="container">
                              <label htmlFor="SenderInput">Enter your username:</label>
                              <input type="text" id="SenderInput" onChange={(e)=>handleChange(e)}></input>
                              <button onClick={()=>connectUser()}>Submit</button>
                    </div>
          )
}