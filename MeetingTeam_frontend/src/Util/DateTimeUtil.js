import moment from "moment";

export function getTimeDistance(input){
          if(!input) return "";
          const inputDate=new Date(input);
          const now=new Date();
          let minutes=Math.round((now.getTime()-inputDate.getTime())/(1000*60));
          if(minutes<60) return minutes+" minutes ago";
          else {
                    let hours=Math.round(minutes/60);
                    if(hours<24) return hours+" hours ago";
                    else {
                              let days=Math.round(hours/24);
                              if(days<31) return days+" days ago";
                              else return inputDate.getDate()+"/"+inputDate.getMonth()+"/"+inputDate.getFullYear();
                    }
          }
}
export function getDateTime(input){
          if(!input) return "";
          const now=new Date();
          const inputDate=new Date(input);
          var time=inputDate.getHours()+":"+inputDate.getMinutes();
          if(now.getFullYear()!=inputDate.getFullYear()
          ||now.getMonth()!=inputDate.getMonth()
          ||now.getDate()!=inputDate.getDate())
          time=time+", "+inputDate.getDate()+"/"+inputDate.getMonth()+"/"+inputDate.getFullYear();
          return time;
}
export function getScheduledTime(meeting){
          const {scheduledTime, scheduledDaysOfWeek, endDateString}=meeting;
          if(!scheduledTime) return "";
          const daysOfWeek=["","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Sartuday"]
          const time=moment(scheduledTime);
          if(scheduledDaysOfWeek&&scheduledDaysOfWeek.size>0){
                    let result="Occurs every ";
                    scheduledDaysOfWeek.forEach(day=>{result+=daysOfWeek[day]+","})
                    result+=" at "+time.format("HH:mm");
                    result+=", from "+time.format("DD-MM-YYYY");
                    if(endDateString){
                              const endDate=moment(endDateString);
                              result+=" to "+endDate.format("DD-MM-YYYY");
                    }
                    return result;
          }
          else return "schedule meeting at "+ time.format("DD-MM-YYYY , HH:mm");
}
export const getDate = (inputDateTime) => {
          if (!inputDateTime) return null;
          let d = moment(inputDateTime);
          return d.format('YYYY-MM-DD');
}
export const getTime = (inputDateTime) => {
          if (!inputDateTime) return null;
          let d = moment(inputDateTime);
          return d.format('HH:mm');
}
export const getHour=(num)=>{
          if(num<=12) return `${num} AM`;
          else return `${num-12} PM`;
}
export const getCalendarTime=(dateTime)=>{
          var result="";
          var hour=dateTime.getHours();
          if(hour<=12) result = (hour+":"+dateTime.getMinutes()+" AM");
          else result = ((hour-12)+":"+dateTime.getMinutes()+" PM");
          return result;
}