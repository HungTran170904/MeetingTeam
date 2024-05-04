import { Link} from "react-router-dom";
import companyIcon from "../../Resource/HUNG_TRAN.png"
import { useSelector } from "react-redux";
import Avatar from "../Avatar/Avartar.js";
const Navbar=()=>{
          const user=useSelector(state=>state.user);
          function handleSignOut(){
            localStorage.removeItem("Authorization");
            window.location.replace("/login")
          }
          return(
                    <header className="p-3 mb-3 border-bottom">
                    <div className="container">
                      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
                              <img src={companyIcon} alt="companyIcon" width="50" height="50"/>
                        </a>
                
                        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                          <li><Link to="/friendChat" className="nav-link px-2 link-secondary">Friends</Link></li>
                          <li><Link to="/teams" className="nav-link px-2 link-body-emphasis">Teams</Link></li>
                          <li><Link to="/requests" className="nav-link px-2 link-body-emphasis">Requests</Link></li>
                          <li><Link to="#" className="nav-link px-2 link-body-emphasis">AI Chat</Link></li>
                        </ul>
                
                        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
                          <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
                        </form>
                
                        <div className="dropdown text-end">
                          <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            {user&&<Avatar src={user.urlIcon}/>}
                          </a>
                          <ul className="dropdown-menu text-small">
                            <li><Link className="dropdown-item" to="/userSettings">Profile</Link></li>
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link className="dropdown-item" onClick={()=>handleSignOut()}>Sign out</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </header>
          )
}
export default Navbar;