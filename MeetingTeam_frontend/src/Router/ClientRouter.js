import { Route, Routes } from "react-router-dom";
import Navbar from "../Component/NavBar/Navbar.js";
import ErrorPage from "../Page/Error/ErrorPage.js";
import TeamsPage from "../Page/Teams/TeamsPage.js";
import UserSettings from "../Page/User/UserSettings.js";
import FriendsPage from "../Page/Friends/FriendsPage.js";
import RequestsPage from "../Page/Requests/RequestsPage.js";

const ClientRouter=()=>{
          return(
          <>
                    <Navbar/>
                    <Routes>
                              <Route path="/friendChat" element={<FriendsPage/>}/>
                              <Route path="/teams" element={<TeamsPage/>}/>
                              <Route path="/userSettings" element={<UserSettings/>}/>
                              <Route path="/requests" element={<RequestsPage/>}/>
                              <Route path="/*" element={<ErrorPage/>}/>
                    </Routes>
          </>
          )
}
export default ClientRouter;