import AxiosService from "../Util/AxiosService.js";
import { API_ENDPOINT } from "../Util/Constraints.js";
const url=API_ENDPOINT+"/api/friendRequest"
export const acceptFriend=(messageId)=>{
          return AxiosService.get(url+"/acceptFriend?messageId="+messageId);
}
export const sendFriendRequest=(email, content)=>{
          const formData=new FormData();
          formData.append("email", email);
          formData.append("content", content)
          return AxiosService.post(url+"/sendFriendRequest",formData);
}
export const getFriendRequests=()=>{
          return AxiosService.get(url+"/getFriendRequests");
}
export const deleteFriendRequest=(requestId)=>{
          return AxiosService.delete(url+"/deleteFriendRequest/"+requestId);
}