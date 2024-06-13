import axios from "axios";

class AxiosService{
          constructor(){
                    const instance=axios.create();
                    instance.interceptors.response.use(this.handleSuccess, this.handleError);
                    this.instance=instance;
                    this.isTokenExpired=false;
          }
          handleSuccess=(res)=>{
                    this.isTokenExpired=false;
                    return res;
          }
          handleError=(err)=>{   
                    const res=err.response;         
                    if(res&&res.status==401&&res.data=="JWT expired"){
                              console.log("This", this);
                              if(!this.isTokenExpired){
                                        this.isTokenExpired=true;
                                        window.location.replace("/login");                            
                                        alert("Token has been expired. Please login again");
                              }
                    }
                    else return Promise.reject(err);
          }
          get=(url)=>{
                    return this.instance.get(url,{withCredentials: true})
          }
          post=(url, body, isJSON)=>{
                   if(isJSON) return this.instance.post(url, body,{
                                        headers: {"Content-Type":"application/json"},
                                        withCredentials: true
                                        });
                    else return this.instance.post(url, body,{withCredentials: true});
          }
          put=(url, body)=>{
                    return this.instance.put(url,body,{withCredentials: true})
          }
          delete=(url)=>{
                    return this.instance.delete(url,{withCredentials: true});
          }
}
export default new AxiosService();