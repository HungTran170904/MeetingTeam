import { Route, Routes } from "react-router-dom";
import Navbar from "../Component/NavBar/Navbar.js";
import ErrorPage from "../Page/Error/ErrorPage.js";
import TeamsPage from "../Page/Teams/TeamsPage.js";
import UserSettings from "../Page/User/UserSettings.js";
import FriendsPage from "../Page/Friends/FriendsPage.js";
import RequestsPage from "../Page/Requests/RequestsPage.js";
import CalendarPage from "../Page/Calendar/CalendarPage.js";
import DashboardPage from "../Page/Dashboard/DashboardPage.js";

const ClientRouter=()=>{
          return(
          <>
                    <Navbar/>
                    <Routes>
                              <Route path="/" element={<DashboardPage/>}/>
                              <Route path="/friendsPage" element={<FriendsPage/>}/>
                              <Route path="/teams" element={<TeamsPage/>}/>
                              <Route path="/userSettings" element={<UserSettings/>}/>
                              <Route path="/requests" element={<RequestsPage/>}/>
                              <Route path="/calendar" element={<CalendarPage/>}/>
                              <Route path="/*" element={<ErrorPage/>}/>
                    </Routes>
          </>
          )
}
export default ClientRouter;