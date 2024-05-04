import { useEffect, useState } from "react";
import { deleteTeamRequest, getSendedRequestMessages, getTeamRequestMessages } from "../../../API/TeamRequestAPI.js";
import Avatar from "../../../Component/Avatar/Avartar.js";
import JoinRequestModal from "./JoinReuqestModal.js";
import TableHeader from "../../../Component/TableHeader/TableHeader.js";
import { getTimeDistance } from "../../../Util/DateTimeUtil.js";

const TeamRequests=()=>{
          const [requests, setRequests]=useState([]);
          const [showJoinRequestModal, setShowJoinRequestModal]=useState(false);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          useEffect(()=>{
                    getSendedRequestMessages().then(res=>{
                              setRequests(res.data);
                    })
          },[])
          function handleUnsendButton(e, requestId){
                    e.preventDefault();
                    deleteTeamRequest(requestId).then(res=>{
                              setRequests(prev=>prev.filter(request=>request.id!=requestId));
                    })
          }
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.team.teamName.match(re);
          }
          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
          <>
                    {showJoinRequestModal&&<JoinRequestModal setShow={setShowJoinRequestModal} />}
                    <div className="chat">
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-6">
                                <div className="chat-about">
                                    <h6 className="m-b-0">Sended Team Requests</h6>
                                    <small>{requests.length} requests</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="request-history">
                    <div className="tablePage">
                              <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                                        <button type="button" className="btn btn-secondary" onClick={()=>setShowJoinRequestModal(true)}>Send team request</button>
                                        <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                                  <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                                  <button className="btn btn-outline-success" type="submit" >Search</button>
                                        </form>
                              </div>
                              <div className="TableWapper border-bottom border-dark">
                              <table className="table table-hover">
                              <TableHeader data={["Name","Message","Time","Action"]} />
                              <tbody>
                              {filterRequests?.map((request)=> {
                                        return (
                                        <tr key={request.id}>
                                                  <td>
                                                            <Avatar src={request.team.urlIcon}/>
                                                            {request.team.teamName}
                                                  </td>
                                                  <td>{request.content}</td>
                                                  <td>{getTimeDistance(request.createdAt)}</td>
                                                  <td>
                                                            <button type="button" className="btn btn-danger" onClick={(e)=>handleUnsendButton(e,request.id)}>Unsend</button>
                                                  </td>
                                        </tr>
                                        )
                              })}
                              </tbody>
                              </table>
                          </div>
                      </div>
                    </div>
                </div>
          </>
          )
}
export default TeamRequests;