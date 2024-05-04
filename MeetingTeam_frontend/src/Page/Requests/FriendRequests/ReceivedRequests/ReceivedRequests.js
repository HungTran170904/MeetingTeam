import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTimeDistance } from "../../../../Util/DateTimeUtil.js";
import Avatar from "../../../../Component/Avatar/Avartar.js";
import TableHeader from "../../../../Component/TableHeader/TableHeader.js";
import { acceptFriend } from "../../../../API/FriendRequestAPI.js";
import { deleteFriendRequest } from "../../../../Redux/friendRequestsReducer.js";

const RecievedRequests=()=>{
          const friendRequests=useSelector(state=>state.friendRequests);
          const user=useSelector(state=>state.user);
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          useEffect(()=>{
                    if(friendRequests){
                        setRequests(friendRequests.filter(request=>request.recipient.id==user.id))
                    }
          },[friendRequests])
          function handleAcceptButton(e, requestId){
                    e.preventDefault();
                    acceptFriend(requestId).catch(err=>alert(err.response.data));
          }
          function handleRejectButton(e, requestId){
                    e.preventDefault();
                    deleteFriendRequest(requestId).catch(err=>alert('There was an error'));
          }
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.sender.nickName.match(re);
          }
          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
          return(
                  <div className="tablePage">
                            <div className="ContentAlignment" style={{marginBottom:"10px"}}>
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
                                                          <Avatar src={request.sender.urlIcon}/>
                                                          {request.sender.nickName}
                                                </td>
                                                <td>{request.content}</td>
                                                <td>{getTimeDistance(request.createdAt)}</td>
                                                <td>
                                                          <button type="button" className="btn btn-success" onClick={(e)=>handleAcceptButton(e,request.id)}>Accept</button>
                                                          <button type="button" className="btn btn-danger" onClick={(e)=>handleRejectButton(e,request.id)}>Reject</button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                  </div>
          )
}
export default RecievedRequests;