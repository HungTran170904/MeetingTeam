import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import "./Login.css";
import { loadUser } from "../../Redux/userReducer.js";
import { login } from "../../API/AuthAPI.js";
import { API_ENDPOINT } from "../../Util/Constraints.js";
const LoginPage=()=>{
          const dispatch=useDispatch();
          const navigate = useNavigate();
          const location=useLocation();
          const [form, setForm] = useState({
                    email: '',
                    password: ''
                })
          const { enqueueSnackbar } = useSnackbar();
          const [error,setError]=useState({ txtEmail: false, txtPassword: false });
          const onSubmit=()=>{
                    let validate = validateData(form)
                    let config = null;
                    let anchorOrigin = { horizontal: 'center' , vertical: 'bottom'}
                    if(validate){
                        login(form.email, form.password).then(res=>{
                            const loginDTO=res.data;
                            localStorage.setItem("tokenExpiredDate", loginDTO.tokenExpiredDate);
                            dispatch(loadUser(loginDTO.user));
                            config = {variant: 'success',anchorOrigin:anchorOrigin}
                            enqueueSnackbar('Login successfully', config);
                            navigate("/friendsPage");
                        })
                        .catch((error)=>{
                            config = {variant: 'error',anchorOrigin:anchorOrigin}
                            let errors = error.response;
                            if(errors==null||!errors.data) enqueueSnackbar('Unknown error', config);
                            else if(errors.status==403&&errors.data=="Account is not activated"){
                              enqueueSnackbar('Your account is not activated', config);
                              navigate("/accountActivation");
                            }
                            else enqueueSnackbar(errors.data, config);
                        })
                }
          }
          const handleChangeValue = (e) => {
                    let name = e.target.name;
                    let value = e.target.value;
                    if (name == 'email') {
                        setForm({ ...form, email: value })
                    }
                    if (name == 'password') {
                        setForm({ ...form, password: value })
                    }
                }
          const validateData = (data) => {
                    let isValid = true;
                    let txtEmail, txtPassword;
                    if (data.email.trim().length == 0) {
                        txtEmail = true;
                        isValid = false;
                    } else {
                        txtEmail = false;
                    }
                    if (data.password.trim().length == 0) {
                        isValid = false;
                        txtPassword = true;
                    } else {
                        txtPassword = false;
                    }
                    setError({ ...error, txtEmail: txtEmail, txtPassword: txtPassword })
                    return isValid;
          }
          useEffect(()=>{
            let searchParams = new URLSearchParams(location.search);
            if(searchParams.has("error")) {
              let config = {variant: 'error',anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
              enqueueSnackbar(searchParams.get("error"), config);
            }
          },[])
          return(
                  <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5">Sign In</h3>
                            <div>
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                <label htmlFor="floatingInput">Email address</label>
                                <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">
                                    Email is required
                                </div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" name="password" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingPassword">Password</label>
                                <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">
                                        Password is required
                              </div>
                              </div>
                              <div className="form-check mb-3">
                                <input className="form-check-input" type="checkbox" value="" id="rememberPasswordCheck"/>
                                <label className="form-check-label" htmlFor="rememberPasswordCheck">
                                  Remember password
                                </label>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Sign in</button>
                                <div className="loginbox-social">
                                <div className="social-title ">Connect with Your Social Accounts</div>
                                <div className="social-buttons">
                                  <a className="button-facebook">
                                      <i className="social-icon fa fa-facebook"></i>
                                  </a>
                                  <a href={API_ENDPOINT+"/oauth2/authorization/github"} className="button-github">
                                      <i className="social-icon fa fa-github"></i>
                                  </a>
                                  <a href={API_ENDPOINT+"/oauth2/authorization/google"} className="button-google">
                                      <i className="social-icon fa fa-google-plus"></i>
                                  </a>
                              </div>
                            </div>
                                  <div className="ContentAlignment">
                                        <Link to="/register">Register new account</Link>
                                        <Link to="/changePassword">Forgot password</Link>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          )
}
export default LoginPage;