import AxiosService from "../Util/AxiosService.js";
import { API_ENDPOINT } from "../Util/Constraints.js";

const url=API_ENDPOINT+"/api/voting";

export const createVoting=(message)=>{
          return AxiosService.post(url+"/createVoting",message,true);
}
export const chooseOption=(messId, optionNames)=>{
          const formData=new FormData();
          formData.append("messId",messId);
          formData.append("optionNames",JSON.stringify(optionNames));
          return AxiosService.post(url+"/chooseOption",formData);
}
export const blockVoting=(messId)=>{
          return AxiosService.get(url+"/blockVoting/"+messId);
}
