import { useSelector } from "react-redux";
import { useState } from "react";
import ChannelModal from "./ChannelModal.js";
import TableHeader from "../../../../Component/TableHeader/TableHeader.js";
import { deleteChannel } from "../../../../API/ChannelAPI.js";
const Channels=({team})=>{
          const user=useSelector(state=>state.user);
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const roleOfUser=team.members.filter(member=>member.u.id==user.id)[0].role;
          const [updatedChannel, setUpdatedChannel]=useState(null)
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.channelName.match(re);
            }
          function handleAddButton(e){
                    e.preventDefault();
                    setUpdatedChannel({
                              teamId: team.id,
                              channelName:"",
                              type:"TEXT_CHANNEL",
                              description:""
                    })                
          }
          function handleUpdateButton(e, channelId){
                    e.preventDefault();
                    const channel={...team.channels.filter(channel=>channel.id==channelId)[0]};
                    channel.teamId=team.id;
                    setUpdatedChannel(channel);
          }
          function handleDeleteButton(e,channelId){
                    e.preventDefault();
                    deleteChannel(channelId);
          }
          const filterChannels=(search=="")?team.channels:team.channels.filter(handleFilter)
          return(
          <>
          {updatedChannel&&<ChannelModal channel={updatedChannel} setChannel={setUpdatedChannel}/>}
          <div className="tablePage">
                    <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                              {(roleOfUser=="LEADER"||roleOfUser=="DEPUTY")&&<button type="button" className="btn btn-secondary" onClick={(e)=>handleAddButton(e)}>Add new channel</button>}
                              <form className="d-flex col-lg-6" role="search" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                        <input className="form-control me-2" type="search" placeholder="Search by name" id="Search" onChange={(e)=>setSearchTerm(e.target.value)}/>
                                        <button className="btn btn-outline-success" type="submit" >Search</button>
                              </form>
                    </div>
                    <div className="TableWapper border-bottom border-dark">
                        <table className="table table-hover">
                            <TableHeader data={["Name","Description","Type","Action"]} />
                            <tbody>
                        {filterChannels?.map((channel, index)=> {
                                return (
                                    <tr key={index}>
                                        <td>{channel.channelName}</td>
                                        <td>{channel.description}</td>
                                        <td>{channel.type}</td>
                                        <td>
                                            {(roleOfUser=="LEADER"||roleOfUser=="DEPUTY")&&
                                            <>
                                            <button type="button" className="btn btn-primary" onClick={(e)=>handleUpdateButton(e,channel.id)}>Update</button>
                                            <button type="button" className="btn btn-danger" onClick={(e)=>handleDeleteButton(e,channel.id)}>Delete</button>
                                            </>}
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
export default Channels;