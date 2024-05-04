import AxiosService from "../Util/AxiosService.js";
import { API_ENDPOINT } from "../Util/Constraints.js";
const url=API_ENDPOINT+"/api/teamRequest"
export const requestToJoinAteam=(message)=>{
          return AxiosService.post(url+"/requestToJoinTeam", message, true);
}
export const acceptNewMember=(teamId, messageId)=>{
          return  AxiosService.get(url+"/acceptNewMember?teamId="+teamId+"&messageId="+messageId);
}
export const getTeamRequestMessages=(teamId)=>{
          return AxiosService.get(url+"/getTeamRequestMessages?teamId="+teamId);
}
export const getSendedRequestMessages=()=>{
          return AxiosService.get(url+"/getSendedRequestMessages");
}
export const deleteTeamRequest=(requestId)=>{
          return AxiosService.delete(url+"/deleteTeamRequest/"+requestId)
}