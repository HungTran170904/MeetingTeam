import { useSelector } from "react-redux";
import "./TeamsPage.css"
import { Accordion } from "react-bootstrap";
import TextChannel from "./TextChannel/TextChannelChat.js";
import { useState } from "react";
import Avatar from "../../Component/Avatar/Avartar.js";
import { Link } from "react-router-dom";
import TeamDetails from "./TeamDetails/TeamDetails.js";
import CreateTeamModal from "./Component/CreateTeamModal.js";
import { ChannelType } from "./Component/ChannelType.js";
import VideoChannel from "./VideoChannel/VideoChannel.js";
const TeamsPage=()=>{
          const teams=useSelector(state=>state.teams);
          const [channelInfo, setChannelInfo]=useState({teamIndex:0, channelIndex:0});
          const [searchTerm, setSearchTerm]=useState("");
          const [search, setSearch]=useState("");
          const [showTeamModal, setShowTeamModal]=useState(false);
          const handleFilter = (item) => {
                    const re = new RegExp("^"+search,"i");
                    return item.teamName.match(re);
          }
          function handle3DotButton(e){
            e.preventDefault();
            setChannelInfo(prev=>{
                return {teamIndex: prev.teamIndex,channelIndex:-1, tabIndex:0};
            })
          }
          let team=null;
          let channel=null;
          if(teams&&teams.length>0){
            team=teams[channelInfo.teamIndex];
            if(team.channels.length>0&&channelInfo.channelIndex>=0) channel=team.channels[channelInfo.channelIndex];
          }
          const filerTeams=(search==="")?teams:teams.filter(handleFilter);
          return(
            <>
            {showTeamModal&&<CreateTeamModal setShow={setShowTeamModal}/>}
             <div className="container-fluid">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                              <div id="teamslist" className="teams-list">
                                    <button className="btn btn-outline-success" onClick={()=>setShowTeamModal(true)}>Create a team</button>
                                    <form className="input-group" onSubmit={(e)=>{e.preventDefault(); setSearch(searchTerm);}}>
                                            <span className="input-group-text"><i className="fa fa-search"></i></span>
                                            <input type="text" className="form-control" placeholder="Search..." onChange={(e)=>setSearchTerm(e.target.value)}/>
                                    </form>
                                    <div className="accordion" id="teams">
                                        {filerTeams.map((team)=>{
                                            return(
                                                    <div className="accordion-item" key={team.id}>
                                                        <h3 className="accordion-header">
                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#team-"+team.id} aria-expanded="false" aria-controls={"team-"+team.id}>
                                                                    <Avatar src={team.urlIcon}/>
                                                                    <div className="about name">{team.teamName}</div>
                                                            </button>
                                                        </h3>
                                                        <div id={"team-"+team.id} className="accordion-collapse collapse" data-bs-parent="#teams">
                                                                <div className="accordion-body channelType">
                                                                        <ChannelType team={team} setChannelInfo={setChannelInfo} channelInfo={channelInfo}/>
                                                                </div>
                                                        </div>
                                                    </div>
                                                )
                                        })}
                                    </div>
                                </div>
                                {team&&
                                <div className="chat">
                                    <div className="chat-header clearfix">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <Avatar src={team.urlIcon}/>
                                                <div className="chat-about">
                                                    <h6 className="m-b-0">{team.teamName}/{channel?channel.channelName:"TeamDetails"}</h6>
                                                    <small>{team.members.length} members</small>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 text-end">
                                                <Link className="btn btn-outline-primary"><i className="fa fa-phone"></i></Link>
                                                <Link className="btn btn-outline-secondary" onClick={(e)=>handle3DotButton(e)}><i className="fa fa-ellipsis-v" aria-hidden="true"></i></Link>
                                            </div>
                                        </div>
                                    </div>
                                        {channel&&channel.type=="TEXT_CHANNEL"&&
                                            <TextChannel team={team} channel={channel} channelInfo={channelInfo}/>}
                                        {channel&&channel.type=="VOICE_CHANNEL"&&
                                            <VideoChannel team={team} channel={channel} channelInfo={channelInfo}/>}
                                        {channel==null&&<TeamDetails team={team} channelInfo={channelInfo} setChannelInfo={setChannelInfo}/>}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
          )
}
export default TeamsPage