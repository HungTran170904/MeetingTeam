import { useState } from "react";
import { getDateTime } from "../../../../Util/DateTimeUtil.js";
import { kickMember, leaveTeam } from "../../../../API/TeamAPI.js";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../../Component/Avatar/Avartar.js";
import FriendsListModal from "./FriendsListModal.js";
import TableHeader from "../../../../Component/TableHeader/TableHeader.js";
import { unsubscribeByTeamId } from "../../../../Util/WebSocketService.js";
import { useSnackbar } from "notistack";
import { deleteTeam } from "../../../../Redux/teamsReducer.js";

const Members=({team})=>{
          const user=useSelector(state=>state.user);
          const members=team.members;
          const roleOfUser=team.members.filter(member=>member.u.id===user.id)[0].role;
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showFriendsList, setShowFriendsList]=useState(false);
          const { enqueueSnackbar } = useSnackbar();
          const dispatch= useDispatch();
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.u.nickName.match(re);
            }
          let filterMembers=(search==="")?members:members.filter(handleFilter);
          function handleKickButton(e,memberId){
                e.preventDefault();
                kickMember(team.id, memberId).then(res=>{
                    const config = {variant: 'success',anchorOrigin: {horizontal: 'center' , vertical: 'bottom'}}
                    enqueueSnackbar('Kick member successfully', config);
                });
          }
          function handleLeaveButton(){
                leaveTeam(team.id).then(()=>{
                    unsubscribeByTeamId(team.id);
                    dispatch(deleteTeam(team.id));
                    const config = {variant: 'info',anchorOrigin: {horizontal: 'center' , vertical: 'bottom'}}
                    enqueueSnackbar("You have leaved the team "+team.teamName, config);
                });
          }
          return(
            <>
            {showFriendsList&&<FriendsListModal team={team} setShow={setShowFriendsList}/>}
          <div className="tablePage">
                    <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                              <button type="button" className="btn btn-primary" onClick={()=>setShowFriendsList(true)}>Add new member</button>
                              <button type="button" className="btn btn-warning" onClick={()=>handleLeaveButton()}>Leave Team</button>
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
                                            {(roleOfUser.role=="LEADER")&&member.u.id===user.id&&
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