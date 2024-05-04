import { useState } from "react"
import FriendRequests from "./FriendRequests/FriendRequests.js"
import "./RequestsPage.css"
import TeamRequests from "./TeamRequests/TeamRequests.js"
const RequestsPage=()=>{
            const tabTitles=["Friend Requests","Team Requests"]
            const [tab, setTab]=useState("Friend Requests")
          return(
          <div className="container">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">
                                <div id="plist" className="request-list">
                                    <ul className="list-unstyled chat-list mt-2 mb-0">
                                        {tabTitles.map((title, index)=>
                                            <li className={"clearfix "+(tab==title?"active":"")} key={index} onClick={()=>setTab(title)}>
                                                  <h6>{title}</h6>
                                            </li> 
                                        )}                             
                                    </ul>
                                </div>
                                {tab==="Friend Requests"&&<FriendRequests/>}
                                {tab=="Team Requests"&&<TeamRequests/>}
                            </div>
                        </div>
                    </div>
          </div>
          )
}
export default RequestsPage;