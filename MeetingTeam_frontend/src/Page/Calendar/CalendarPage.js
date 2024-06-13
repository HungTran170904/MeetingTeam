import { useEffect, useState } from "react";
import "./Calendar.css";
import { getCalendarTime, getDate, getHour } from "../../Util/DateTimeUtil.js";
import { getMeetingsOfWeek } from "../../API/MeetingAPI.js";
import MeetingModal from "../Teams/VideoChannel/Component/MeetingModal.js";
import { useSelector } from "react-redux";

const CalendarPage=()=>{
        const user=useSelector(state=>state.user);
        const [week, setWeek]=useState(0);
        const [weekRange, setWeekRange]=useState([new Date(), new Date()]);
        const [meetings, setMeetings]=useState([]);
        const [meetingModal, setMeetingModal]=useState(null);   
        const [mIndexesOfDays, setMIndexesOfDays]=useState([[],[],[],[],[],[],[]]);
        const daysOfWeek=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const colors=["btn-primary","btn-secondary","btn-success","btn-danger","btn-warning","btn-info","btn-light","btn-dark"];
        const hours=Array.from({ length: 24 }, (_, i) => i);

        function chooseColor(colorIndex){
            if(colorIndex<colors.length-1) colorIndex++;
            else colorIndex=0;
            return colorIndex;
        }
        function handleDetailBtn(mIndex){
            var meeting={...meetings[mIndex]};
            meeting.scheduledDaysOfWeek=new Set(meeting.scheduledDaysOfWeek);
            setMeetingModal(meeting);
        }
        useEffect(()=>{
            getMeetingsOfWeek(week).then(res=>{
                let colorIndex=0;
                setMeetings(res.data.meetings.map(m=>{
                    m.scheduledTime=new Date(m.scheduledTime);
                    colorIndex=chooseColor(colorIndex);
                    m.color=colors[colorIndex];
                    return m;
                }));
                setWeekRange(res.data.weekRange);               
            })
            .catch(err=>alert(err));
        },[week]);
        useEffect(()=>{
            const updatedData=[];
            for(let i=0;i<7;i++) updatedData.push([]);
            for(let i=0;i<meetings.length;i++){                
                if(meetings[i].scheduledDaysOfWeek&&meetings[i].scheduledDaysOfWeek.length>0){
                    for(var day of meetings[i].scheduledDaysOfWeek)
                        updatedData[day-1].push(i);
                }
                else{
                    let dayOfWeek=meetings[i].scheduledTime.getDay(); //0: Sun to 6:Sat
                    updatedData[dayOfWeek].push(i);
                }
                setMIndexesOfDays(updatedData);
            }
        },[meetings])
        return(
            <>
            {meetingModal!=null&&
                <MeetingModal meeting={meetingModal} setShow={setMeetingModal} 
                    noChange={user.id!=meetingModal.creatorId}/>}
            <div className="container">
                <div className="ContentAlignment" style={{marginBottom:"10px"}}>
                    <button type="button" className="btn btn-dark" onClick={()=>setWeek(week-1)}>{"<<"}</button>
                    <h6>{getDate(weekRange[0])}-{getDate(weekRange[1])}</h6>
                    <button type="button" className="btn btn-dark" onClick={()=>setWeek(week+1)}>{">>"}</button>
                    <h5 className="text-center">Meeting Calendar</h5>
                </div>
                <div className="table-responsive schedule-table">
                    <table className="table table-bordered text-center fixed-table">
                    <thead>
                        <tr>
                            <th className="text-uppercase">Time/Day</th>
                            {daysOfWeek.map((day, index)=>(<th className="text-uppercase" key={index}>{day}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {hours.map(hour=>{
                            return(
                                <tr key={hour}>
                                    <th className="align-middle" style={{backgroundColor: "#F0F1F3"}}>
                                        <div>{getHour(hour)}</div>
                                    </th>
                                    {daysOfWeek.map((_,index)=>{
                                        const mIndexes=mIndexesOfDays[(index==6)?0:index+1];
                                        return(
                                            <td key={index}>
                                            {mIndexes?.map(mIndex=>{
                                                if(mIndex>=meetings.length) return;
                                                var meeting=meetings[mIndex];
                                                if(meeting.scheduledTime.getHours()==hour)
                                                return (                                                
                                                    <div key={mIndex} className="meeting-info">
                                                        <button type="button" className={"btn "+meeting.color} 
                                                                onClick={()=>handleDetailBtn(mIndex)}>
                                                                {meeting.title}
                                                        </button>
                                                        <div className="time-info">Starts at {getCalendarTime(meeting.scheduledTime)}</div>
                                                </div>)
                                            })}
                                            </td>)
                                    })}
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
export default CalendarPage;