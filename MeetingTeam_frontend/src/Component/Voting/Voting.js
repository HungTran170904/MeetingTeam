import { useSelector } from "react-redux";
import { getDateTime } from "../../Util/DateTimeUtil.js";
import "./Voting.css";
import { blockVoting } from "../../API/VoteAPI.js";

const Voting=({message,creatorNickName,setShow})=>{
          const user=useSelector(state=>state.user);
          function handleBlockBtn(){
            blockVoting(message.id).catch(err=>alert(err));
          }
          let voteNum=0;
          for(let option of message.voting.options) voteNum+=option.userIds.length;
          return(
          <div className="card voting-card">
                    <div className="card-body">
                        <div className="text-center h5">{message.content}</div>
                        <div className="h6" style={{ fontStyle: "italic" }}>Created by {creatorNickName} at {getDateTime(message.voting.events[0].createdAt)}</div>
                        <div className="h6">{voteNum} votes {message.voting.endTime&&<>- Ended at {getDateTime(message.voting.endTime)}</>}</div>
                        <div style={{ fontStyle: "italic" }}>Latest change: {message.voting.events.slice(-1)[0].content}</div>
                        {message.voting.options?.map((option, index)=>{
                              return(
                              <div key={index} className="row proccess-align">
                                        <div className="col-lg-11">
                                                  <div className="progress" role="progressbar" style={{height: "30px"}} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                                            <div className="progress-bar btn-info overflow-visible text-dark" style={{width: `${option.userIds.length*100/voteNum}%`}}>
                                                                      <b>{option.name}</b>
                                                            </div>
                                                  </div>
                                        </div>
                                        <div className="col-lg-1">{option.userIds.length}</div>
                              </div>
                              )
                        })}
                    <div className="mt-3 d-flex justify-content-between align-items-center">
                            <button type="button" className="btn btn btn-warning" onClick={()=>setShow({type:1, message})}> Vote </button>
                            <button type="button" className="btn btn-info" onClick={()=>setShow({type:2, message})}>View TeamDetails</button>
                            {user.id==message.senderId&&<button type="button" className="btn btn-danger" onClick={handleBlockBtn}>Block</button>}
                    </div>
                    </div>                                                  
          </div>                   
          )
}
export default Voting;