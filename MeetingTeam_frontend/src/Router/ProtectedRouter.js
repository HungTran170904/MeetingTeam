import { Navigate, useLocation } from "react-router-dom";
import DataLoading from "../DataLoading/DataLoading.js";

const ProtectedRouter=({children})=>{
          const location=useLocation();

          function saveTokenExpiredDateParam(){
                    let searchParams = new URLSearchParams(location.search);
                    if(searchParams.has("tokenExpiredDate")){
                              localStorage.setItem("tokenExpiredDate",searchParams.get("tokenExpiredDate"))
                    }
          }

          var isExpired=true;
          saveTokenExpiredDateParam();
          var tokenExpiredDateStr=localStorage.getItem("tokenExpiredDate");
          if(tokenExpiredDateStr){
                    const tokenExpiredDate=new Date(tokenExpiredDateStr);
                    const now=new Date();
                    isExpired=(now>=tokenExpiredDate);
          }
          if(isExpired) return(<Navigate replace to="/login" />);
          else return (<DataLoading>{children}</DataLoading>);
}
export default ProtectedRouter;