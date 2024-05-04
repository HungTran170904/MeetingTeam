import AxiosService from "../Util/AxiosService.js"
import { API_ENDPOINT } from "../Util/Constraints.js"
const url=API_ENDPOINT+"/api/team"
export const createTeam=(team)=>{
          return AxiosService.post(url+"/createTeam", team, true);
}
export const getJoinedTeams=()=>{
          return AxiosService.get(url+"/getJoinedTeams");
}
export const updateTeam=(teamDTO, file)=>{
          const formData=new FormData();
          formData.append("teamDTO", JSON.stringify(teamDTO));
          formData.append("file", file);
          return AxiosService.put(url+"/updateTeam", formData);
}
export const leaveTeam=(teamId)=>{
          return AxiosService.get(url+"/leaveTeam/"+teamId);
}
export const kickMember=(teamId, memberId)=>{
          return AxiosService.get(url+"/kickMember?teamId="+teamId+"&memberId="+memberId);
}
export const addFriendsToTeam=(friendIds, teamId)=>{
          const formData=new FormData();
          formData.append("friendIds", JSON.stringify(friendIds));
          formData.append("teamId", teamId);
          return AxiosService.post(url+"/addFriendsToTeam",formData);
}