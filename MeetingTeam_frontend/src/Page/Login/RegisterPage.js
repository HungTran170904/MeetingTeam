import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { enqueueSnackbar, useSnackbar } from "notistack";
import "./Login.css";
import { registerUser } from "../../API/AuthAPI.js";

const RegisterPage=()=>{
          const navigate = useNavigate();
          const { enqueueSnackbar } = useSnackbar();
          const [userDTO, setUserDTO] = useState({
                    email: '',
                    password: '',
                    confirmPassword:'',
                    nickName:'',
                    birthday:null,
                })
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null});
          const onSubmit=()=>{
                    let validate = validateData(userDTO);
                    let anchorOrigin = { horizontal: 'center' , vertical: 'bottom'}
                    if(validate){
                        const dto={
                          email: userDTO.email,
                          password: userDTO.password,
                          nickName: userDTO.nickName,
                          birthday: userDTO.birthday,
                        }
                        registerUser(dto).then(res=>{
                            let config = {variant: 'success',anchorOrigin:anchorOrigin}
                            enqueueSnackbar('Register new account successfully', config);
                            navigate("/accountActivation");
                        })
                        .catch((err)=>{
                            let config = {variant: 'error',anchorOrigin:anchorOrigin}
                            let errors = err.response;
                            if(errors==null||!errors.data) enqueueSnackbar('Unknown error', config);
                            else enqueueSnackbar(errors.data, config);
                        })
                }
          }
          const validateData = (data) => {
                    let txtEmail=null, txtPassword=null, txtConfirmPassword=null;
                    if (data.email.trim().length == 0) {
                        txtEmail = "Email is required";
                    } 
                    if (data.password.trim().length == 0) {
                        txtPassword = "Password is required";
                    } 
                    if(data.confirmPassword!=data.password){
                      txtConfirmPassword="Confirm password is mismatched with password"
                    }
                    setError({txtEmail: txtEmail, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword})
                    return !(txtEmail||txtPassword||txtConfirmPassword);
          }
          const handleChangeValue=(e)=>{
                  const newDTO={...userDTO};
                  newDTO[e.target.name]=e.target.value;
                  setUserDTO(newDTO);
          }
          return(
                    <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5">Register new account</h3>
                            <div>
                              <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                <label htmlFor="floatingInput">Email address</label>
                                <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" name="password" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingPassword">Password</label>
                                <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingConPass" name="confirmPassword" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                <label htmlFor="floatingConPass">Confirm Password</label>
                                <div style={error.txtConfirmPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtConfirmPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                <input type="text" className="form-control" id="floatingNickName" name="nickName" onChange={(e)=>handleChangeValue(e)} placeholder="nickName"/>
                                <label htmlFor="floatingPassword">Nick Name</label>
                              </div>
                              <div className="form-floating mb-3">
                                 <input type="date" className="form-control" id="floatingBirthday" name="birthday" onChange={(e)=>handleChangeValue(e)}/>
                                 <label htmlFor="floatingBirthday">Birthday</label>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Register</button>
                                
                                  <div className="contentCenter">
                                        Have an account? <Link to="/login">Sign in</Link>
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
export default RegisterPage;