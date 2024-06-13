import AxiosService from "../Util/AxiosService.js"
import { API_ENDPOINT } from "../Util/Constraints.js"

const url=API_ENDPOINT+"/api/meeting"
export const createMeeting=(meetingDTO)=>{
          return AxiosService.post(url+"/createMeeting",meetingDTO, true);
}
export const updateMeeting=(meetingDTO)=>{
          return AxiosService.put(url+"/updateMeeting", meetingDTO);
}
export const registerEmailNotification=(meetingId, receiveEmail)=>{
          return AxiosService.get(url+"/registerEmailNotification?meetingId="+meetingId+"&receiveEmail="+receiveEmail);
}
export const addToCalendar=(meetingId, isAdded)=>{
          return AxiosService.get(url+"/addToCalendar?meetingId="+meetingId+"&isAdded="+isAdded);
}
export const getMeetingsOfWeek=(week)=>{
          return AxiosService.get(url+"/meetingsOfWeek/"+week);
}
export const getVideoChannelMeetings=(channelId,receivedMeetingNum)=>{
          return AxiosService.get(url+"/getVideoChannelMeetings?channelId="+channelId+"&receivedMeetingNum="+receivedMeetingNum)
}
export const cancelMeeting=(meetingId)=>{
          return AxiosService.delete(url+"/cancelMeeting/"+meetingId)
}
export const generateToken=(meetingId)=>{
          return AxiosService.get(url+"/generateToken?meetingId="+meetingId);
}
export const deleteMeeting=(meetingId)=>{
          return AxiosService.delete(url+"/deleteMeeting/"+meetingId)
}