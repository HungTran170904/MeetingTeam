import { Navigate } from "react-router-dom";
import DataLoading from "../DataLoading/DataLoading.js";

const ProtectedRouter=({children})=>{
          var isExpired=true;
          var tokenExpiredDateStr=localStorage.getItem("tokenExpiredDate");
          if(tokenExpiredDateStr){
                    const tokenExpiredDate=new Date(tokenExpiredDateStr);
                    console.log("expiredDate", tokenExpiredDate);
                    const now=new Date();
                    isExpired=(now>=tokenExpiredDate);
          }
          if(isExpired) return(<Navigate replace to="/login" />);
          else return (<DataLoading>{children}</DataLoading>);
}
export default ProtectedRouter;