import { useSelector } from "react-redux";
import { reactMessage, unsendMessage } from "../../Util/WebSocketService.js";

const MessageDropdown=({message, setTextMessage, setReplyMessage})=>{
          const user=useSelector(state=>state.user);
          if(message.messageType=="UNSEND") return "";
          function handleDropdownItem(e){
              e.preventDefault();
              var name=e.target.name;
              if(name=="Edit") setTextMessage(message.content);
              else if(name=="Reply") setReplyMessage(message);
              else if(name=="Delete"){
                  unsendMessage(message.id);
              }
          }
          const emojiCodes = ["2764", "1F600", "1F641", "1F642"];
          function handleEmoji(e,emojiCode){
              e.preventDefault();
              reactMessage(message.id, {
                    userId: user.id,
                    emojiCode: emojiCode
              })
          }
          return(
              <div className="dropdown">
                  <button className="btn btn-light btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"></button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          {message.messageType=="TEXT"&&<li><a className="dropdown-item" name="Edit" onClick={(e)=>handleDropdownItem(e)}>Edit</a></li>}
                          <li><a className="dropdown-item" name="Reply" onClick={(e)=>handleDropdownItem(e)}>Reply</a></li>
                          {message.senderId==user.id&&<li><a className="dropdown-item" name="Delete" onClick={(e)=>handleDropdownItem(e)}>Delete</a></li>}
                          <li>
                                  <div className="d-flex align-items-center bg-light rounded-pill p-2 reaction-list">
                                      {emojiCodes.map((code, index)=>
                                          <span className="fs-4 me-2" key={index} onClick={(e)=>handleEmoji(e, code)}>{String.fromCodePoint(`0x${code}`)}</span>
                                      )}
                                      <span className="fs-4 me-2" onClick={(e)=>handleEmoji(e, null)}>X</span>
                                  </div> 
                              </li>
                  </ul>
              </div>
          )
      }
export default MessageDropdown;