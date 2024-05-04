import AxiosService from "../Util/AxiosService.js";
import { API_ENDPOINT } from "../Util/Constraints.js";

const url=API_ENDPOINT+"/api/auth"
export const registerUser=(userDTO)=>{
          return AxiosService.post(url+"/registerUser",userDTO, true);
}
export const login=(email, password)=>{
          const formData=new FormData();
          formData.append('email', email)
          formData.append('password', password)
          return AxiosService.post(url+"/login", formData);
}
export const changePassword=(email,newPassword, OTPcode)=>{
          const formData=new FormData();
          formData.append('email', email)
          formData.append('newPassword', newPassword)
          formData.append("OTPcode", OTPcode);
          return AxiosService.post(url+"/changePassword", formData);
}
export const activateUser=(email, OTPcode)=>{
          const formData=new FormData();
          formData.append('email', email);
          formData.append("OTPcode", OTPcode);
          return AxiosService.post(url+"/activateUser", formData);
}
export const sendOTPcode=(email)=>{
          return AxiosService.get(url+"/sendOTPcode?email="+email);
}
