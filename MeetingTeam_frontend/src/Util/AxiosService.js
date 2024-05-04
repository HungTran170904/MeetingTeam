import axios from "axios";

class AxiosService{
          constructor(){
                    const instance=axios.create();
                    instance.interceptors.response.use(this.handleSuccess, this.handleError);
                    this.instance=instance;
          }
          handleSuccess(res){
                    return res;
          }
          handleError(err){
                    console.log("Axios Error", err);    
                    const res=err.response;             
                    if(res&&res.status==401&&res.data=="JWT was exprired or incorrect"){
                              alert("Token has been expired. Please login again")
                              window.location.replace("/login")
                    }
                    return Promise.reject(err);
          }
          get(url){
                    return this.instance.get(url,{withCredentials: true})
          }
          post(url, body, isJSON){
                   if(isJSON) return this.instance.post(url, body,{
                                        headers: {"Content-Type":"application/json"},
                                        withCredentials: true
                                        });
                    else return this.instance.post(url, body,{withCredentials: true});
          }
          put(url, body){
                    return this.instance.put(url,body,{withCredentials: true})
          }
          delete(url){
                    return this.instance.delete(url,{withCredentials: true});
          }
}
export default new AxiosService();