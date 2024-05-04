import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import DataLoading from "../DataLoading/DataLoading.js";

const ProtectedRouter=({children})=>{
          if(Cookies.get("Authorization")){
                    return (<DataLoading>{children}</DataLoading>);
          } 
          else return(<Navigate replace to="/login" />);
}
export default ProtectedRouter;