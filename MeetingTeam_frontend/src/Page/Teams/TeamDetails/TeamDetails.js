import { useState } from "react";
import "./TeamDetails.css"
import { Link } from "react-router-dom";
import Members from "./Members/Members.js";
import PendingRequest from "./PendingRequests/PendingRequest.js";
import Settings from "./Settings/Settings.js";
import Channels from "./Channels/Channels.js";
import { useSelector } from "react-redux";
import { tabTitles } from "../../../Util/Constraints.js";

const TeamDetails=({team, channelInfo, setChannelInfo})=>{
            const user=useSelector(state=>state.user);
           let roleOfUser=team.members.filter(member=>member.u.id==user.id)[0].role;
           function handleTabClick(tabIndex){
                setChannelInfo({...channelInfo, tabIndex:tabIndex});
           }
          return(
                    <>
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-9">
                                <nav class="nav nav-pills nav-justified">
                                            {tabTitles.map((title,index)=>
                                                <Link key={index} className={"nav-link"+(channelInfo.tabIndex===index?" active":"")} 
                                                    onClick={()=>handleTabClick(index)}>{title}</Link>
                                        )}
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="chat-history">
                            {channelInfo.tabIndex==0&&<Members team={team}/>}
                            {channelInfo.tabIndex==1&&(roleOfUser=="LEADER"||roleOfUser=="DEPUTY")
                                &&<PendingRequest team={team}/>}
                            {channelInfo.tabIndex==2&&<Settings team={team}/>}
                            {channelInfo.tabIndex==3&&<Channels team={team}/>}
                    </div>
           </>
          )
}
export default TeamDetails;