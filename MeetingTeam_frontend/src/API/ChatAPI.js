import AxiosService from "../Util/AxiosService.js"
import { API_ENDPOINT } from "../Util/Constraints.js"
const url=API_ENDPOINT+"/api/chat"
export const sendFileMessage=(message, file)=>{
          const formData=new FormData();
          formData.append("message", JSON.stringify(message));
          formData.append("file", file);
          return AxiosService.post(url+"/fileMessage", formData);
}
export const sendPrivateFileMessage=(message, file)=>{
          const formData=new FormData();
          formData.append("message", JSON.stringify(message));
          formData.append("file", file);
          return AxiosService.post(url+"/privateFileMessage", formData);
}
export const getPrivateMessages=(receivedMessageNum, friendId)=>{
          return AxiosService.get(url+"/getPrivateMessages?receivedMessageNum="+receivedMessageNum+"&friendId="+friendId);
}
export const getTextChannelMessages=(receivedMessageNum, channelId)=>{
          return AxiosService.get(url+"/getTextChannelMessages?receivedMessageNum="+receivedMessageNum+"&channelId="+channelId);
}