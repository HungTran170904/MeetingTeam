import AxiosService from "../Util/AxiosService"
import { API_ENDPOINT } from "../Util/Constraints";

const url=API_ENDPOINT+'/api/user';

export const getUserInfo=()=>{
          return AxiosService.get(url+"/getUserInfo");
}
export const updateUser=(userDTO,currentPassword,file)=>{
          const formData=new FormData();
          formData.append("userDTO", JSON.stringify(userDTO));
          formData.append("currentPassword", currentPassword)
          formData.append("file",file);
          return AxiosService.put(url+"/updateUser", formData);
}
export const getFriends=()=>{
          return AxiosService.get(url+"/getFriends");
}
export const unfriend=(friendId)=>{
          return AxiosService.delete(url+"/unfriend/"+friendId);
}
