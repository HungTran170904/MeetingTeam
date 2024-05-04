import { useDispatch, useSelector } from "react-redux";
import { reactMeeting } from "../../../../Util/WebSocketService.js";
import { addToCalendar, cancelMeeting, registerEmailNotification } from "../../../../API/MeetingAPI.js";
import { updateMeetings } from "../../../../Redux/teamsReducer.js";
import { updateCalendarMeetingIds } from "../../../../Redux/userReducer.js";

const MeetingDropdown=({team,setMeetingDTO,meeting, setMeetingMessages})=>{
          const dispatch=useDispatch();
          const user=useSelector(state=>state.user);
          const emojiCodes = ["2764", "1F600", "1F641", "1F642"];
          function handleEmoji(e,emojiCode){
              e.preventDefault();
              reactMeeting(meeting.id, {
                    userId: user.id,
                    emojiCode: emojiCode
              })
          }
          function handleEmailCheckbox(){
                registerEmailNotification(meeting.id,!meeting.emailsReceivedNotification.has(user.email)).then(res=>{
                    const emails=new Set([...meeting.emailsReceivedNotification]);
                    if(emails.has(user.email)) emails.delete(user.email);
                    else  emails.add(user.email);
                    dispatch(updateMeetings({teamId:team.id, meeting:{...meeting, emailsReceivedNotification:emails}}))
                })
                .catch(err=>console.log(err))
          }
          function handleCalendarCheckbox(){
                addToCalendar(meeting.id,user.calendarMeetingIds.has(meeting.id)).then(res=>{
                    const meetingIds=new Set([...user.calendarMeetingIds]);
                    if(meetingIds.has(meeting.id)) meetingIds.delete(meeting.id)
                    else meetingIds.add(meeting.id);
                    dispatch(updateCalendarMeetingIds(meetingIds))
                })
                .catch(err=>console.log(err))
          }
          function handleCancelCheckbox(){
            cancelMeeting(meeting.id);
          }
          function handleEditMeeting(){
            setMeetingDTO({
                id: meeting.id,
                title: meeting.title,
                scheduledTime: new Date(meeting.scheduledTime),
                scheduledDaysOfWeek: new Set(meeting.scheduledDaysOfWeek),
                endDate: new Date(meeting.endDate)
            })
          }
          return(
                    <div className="dropdown">
                              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id={"meetingDropdown"+meeting.id}>
                                        Settings
                              </button>
                              <ul className="dropdown-menu" aria-labelledby={"meetingDropdown"+meeting.id}>
                                        {meeting.creatorId===user.id&&<li><a className="dropdown-item" onClick={()=>handleEditMeeting()}>Edit meeting</a></li>}
                                        <li><a className="dropdown-item" onClick={()=>setMeetingMessages(meeting.messages)}>Meeting history</a></li>
                                        {meeting.creatorId==user.id&&
                                            <li><div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" id={"isCanceled"+meeting.id} checked={meeting.isCanceled} onChange={()=>handleCancelCheckbox()}/>
                                                <label className="form-check-label" htmlFor={"isCanceled"+meeting.id}>Cancel meeting</label>
                                            </div></li>}
                                            <li><div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" checked={user.calendarMeetingIds.has(meeting.id)} onChange={()=>handleCalendarCheckbox()}  id={"isCanceled"+meeting.id}/>
                                                <label className="form-check-label" htmlFor={"isCanceled"+meeting.id}>Add to calender</label>
                                            </div></li>
                                            <li><div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" id={"isCanceled"+meeting.id} checked={meeting.emailsReceivedNotification.has(user.email)} onChange={()=>handleEmailCheckbox()}/>
                                                <label className="form-check-label" htmlFor={"isCanceled"+meeting.id}>Receive email notification</label>
                                            </div></li>
                                            <li><div className="d-flex align-items-center bg-light rounded-pill p-2 reaction-list">
                                                  {emojiCodes.map((code, index)=>
                                                            <span className="fs-4 me-2" key={index} onClick={(e)=>handleEmoji(e, code)}>{String.fromCodePoint(`0x${code}`)}</span>
                                                  )}
                                                  <span className="fs-4 me-2" onClick={(e)=>handleEmoji(e, null)}>X</span>
                                        </div></li>
                              </ul>
                    </div>
          )
}
export default MeetingDropdown;