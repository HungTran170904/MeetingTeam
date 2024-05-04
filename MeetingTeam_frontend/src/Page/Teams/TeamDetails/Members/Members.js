import { useState } from "react";
import { getDateTime } from "../../../../Util/DateTimeUtil.js";
import { kickMember } from "../../../../API/TeamAPI.js";
import { useSelector } from "react-redux";
import Avatar from "../../../../Component/Avatar/Avartar.js";
import FriendsListModal from "./FriendsListModal.js";
import TableHeader from "../../../../Component/TableHeader/TableHeader.js";

const Members=({team})=>{
          const user=useSelector(state=>state.user);
          const members=team.members;
          const roleOfUser=members.filter(member=>member.u.id===user.id)[0].role;
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showFriendsList, setShowFriendsList]=useState(false);
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.u.nickName.match(re);
            }
          let filterMembers=(search==="")?members:members.filter(handleFilter);
          function handleKickButton(e,memberId){
                e.preventDefault();
                kickMember(team.id, memberId);
          }
          return(
            <>
            {showFriendsList&&<FriendsListModal team={team} setShow={setShowFriendsList}/>}
          <div className="tablePage">
                    <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                              <button type="button" className="btn btn-primary" onClick={()=>setShowFriendsList(true)}>Add new member</button>
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                        <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        <button className="btn btn-outline-success" type="submit" >Search</button>
                              </form>
                    </div>
                    <div className="TableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name", "Email","Last active","Role","Action"]} />
                            <tbody>
                        {filterMembers?.map((member, index)=> {
                            if(member.role!="LEAVE")
                                return (
                                    <tr key={index}>
                                        <td>
                                            <Avatar src={member.u.urlIcon}/>
                                            {member.u.nickName}
                                        </td>
                                        <td>{member.u.email}</td>
                                        <td>{getDateTime(member.u.lastActive)}</td>
                                        <td>{member.role}</td>
                                        <td>
                                            {(roleOfUser=="LEADER")&&member.u.id!=user.id&&
                                            <button type="button" className="btn btn-danger" onClick={(e)=>handleKickButton(e,member.u.id)}>Kick member</button>}
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
export default Members;