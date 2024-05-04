import AxiosService from "../Util/AxiosService.js"
import { API_ENDPOINT } from "../Util/Constraints.js"
const url=API_ENDPOINT+"/api/channel"
export const updateChannel=(channelDTO)=>{
          return AxiosService.post(url+"/updateChannel", channelDTO, true);
}
export const deleteChannel=(channelId)=>{
          return AxiosService.delete(url+"/deleteChannel/"+channelId);
}