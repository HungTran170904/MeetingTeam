import { useEffect, useState } from "react"
import { generateToken } from "../../API/MeetingAPI.js";

const ZegoMeeting=()=>{
         const [token, setToken]=useState(null);
          useEffect(()=>{
                    let meetingId=getMeetingId();
                    if(meetingId) generateToken(meetingId)
                                        .then(res=>setToken(res.data))
                                        .catch(err=>alert(err));
          })
          function getMeetingId() {
                    let urlStr = window.location.href.split('?')[1];
                    const urlSearchParams = new URLSearchParams(urlStr);
                    const result = Object.fromEntries(urlSearchParams.entries());
                    return result["meetingId"];
          }
          return(
                    <div></div>
          )
}
export default ZegoMeeting