import { useEffect, useState } from "react";
import { deleteFriendRequest} from "../../../../API/FriendRequestAPI.js";
import Avatar from "../../../../Component/Avatar/Avartar.js";
import { getTimeDistance } from "../../../../Util/DateTimeUtil.js";
import TableHeader from "../../../../Component/TableHeader/TableHeader.js";
import { AddFriendModal } from "./RequestModal.js";
import { useSelector } from "react-redux";

const SendedRequests=()=>{
          const friendRequests=useSelector(state=>state.friendRequests);
          const user=useSelector(state=>state.user);
          const [requests, setRequests]=useState([]);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showAddFriendModal, setShowAddFriendModal]=useState(false);
          useEffect(()=>{
                    if(friendRequests){
                        setRequests(friendRequests.filter(request=>request.sender.id==user.id))
                    }
          },[friendRequests])
          function handleUnsendButton(e, requestId){
                    e.preventDefault();
                    deleteFriendRequest(requestId).then(res=>{
                              setRequests(prev=>prev.filter(request=>request.id!=requestId));
                    })
          }
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.recipient.nickName.match(re);
          }
          const filterRequests=(search==="")?requests:requests.filter(handleFilter);
         return(
          <>
            {showAddFriendModal&&<AddFriendModal setShow={setShowAddFriendModal}/>}
          <div className="tablePage">
                    <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                              <button type="button" className="btn btn-secondary" onClick={()=>setShowAddFriendModal(true)}>Add friend</button>
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
                                                  <Avatar src={request.recipient.urlIcon}/>
                                                  {request.recipient.nickName}
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
          </> 
         )
}
export default SendedRequests;