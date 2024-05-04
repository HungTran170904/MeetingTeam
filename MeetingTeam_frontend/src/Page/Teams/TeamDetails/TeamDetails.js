import { useState } from "react";
import "./TeamDetails.css"
import { Link } from "react-router-dom";
import Members from "./Members/Members.js";
import PendingRequest from "./PendingRequests/PendingRequest.js";
import Settings from "./Settings/Settings.js";
import Channels from "./Channels/Channels.js";
const TeamDetails=({team})=>{
          const [tab, setTab]=useState("Members");
          const tabTitles=["Members", "Pending Requests", "Channels","Settings"]
          return(
                    <>
                    <div className="chat-header clearfix">
                        <div className="row">
                            <div className="col-lg-9">
                                <nav class="nav nav-pills nav-justified">
                                            {tabTitles.map((title)=>
                                                <Link key={title} className={"nav-link"+(tab===title?" active":"")} onClick={(e)=> setTab(title)}>{title}</Link>
                                        )}
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="chat-history">
                            {tab=="Members"&&<Members team={team}/>}
                            {tab=="Pending Requests"&&<PendingRequest team={team}/>}
                            {tab=="Settings"&&<Settings team={team}/>}
                            {tab=="Channels"&&<Channels team={team}/>}
                    </div>
           </>
          )
}
export default TeamDetails;