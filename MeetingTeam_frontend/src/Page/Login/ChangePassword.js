import { useNavigate } from "react-router-dom";
import { changePassword, sendOTPcode } from "../../API/AuthAPI.js";
import { useSnackbar } from "notistack";
import { useState } from "react";

const ChangePassword=()=>{
          const navigate = useNavigate();
          const { enqueueSnackbar } = useSnackbar();
          const [data, setData]=useState({
              email:"",
              newPassword:"",
              confirmPassword:"",
              OTPcode:""
          });
          const [error,setError]=useState({ txtEmail: null, txtPassword: null,txtConfirmPassword:null, txtOTP:null});
          function handleChangeValue(e, fieldName){
              setData(prev=>{
                prev[fieldName]=e.target.value;
                return prev;
              });
          }
          function handleOTPbutton(e){
              e.preventDefault();
              if (data.email.trim().length == 0) {
                setError({txtEmail:"Email is required"});
            }
              sendOTPcode(data.email).catch(err=>setError({txtOTP:err.response.data}));
          }
          function validateData(data){
            let txtEmail=null, txtPassword=null, txtConfirmPassword=null, txtOTP=null;
            if (data.email.trim().length == 0) {
                txtEmail = "Email is required";
            } 
            if(data.OTPcode.trim().length==0){
              txtOTP="OTP is required";
            }
            if (data.password.trim().length == 0) {
                txtPassword = "Password is required";
            } 
            if(data.confirmPassword!=data.password){
              txtConfirmPassword="Confirm password is mismatched with password"
            }
            setError({txtEmail: txtEmail, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword, txtOTP:txtOTP})
            return !(txtEmail||txtPassword||txtConfirmPassword||txtOTP);
      }
          function onSubmit(e){
            e.preventDefault();
            if(validateData(data)){
              changePassword(data.email, data.newPassword, data.OTPcode).then(res=>{
                  let config = {variant: 'success',anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                  enqueueSnackbar("Change password successfully", config);
                  navigate("/login");
              })
              .catch(err=>{
                let config = {variant: 'error',anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                enqueueSnackbar(err.response.data, config);
              })
            }
          }
          return(
          <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5 fw-light fs-5">Change Password</h3>
                            <div>
                              <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" name="email" onChange={(e)=>handleChangeValue(e)} placeholder="email"/>
                                        <label htmlFor="floatingInput">Email</label>
                                        <div style={error.txtEmail ? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                              </div>
                              <div className="mb-3">
                                  <div className="input-group">
                                        <input type="text" className="form-control" placeholder="Enter OTP code" onChange={(e)=>handleChangeValue(e,"OTPcode")}/>
                                        <button className="btn btn-success" id="otp" onClick={(e)=>handleOTPbutton(e)}>Send OTP code</button>
                                  </div>
                                  <div style={error.txtOTP ? { display: ''} : { display: 'none' }} className="error">{error.txtOTP}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" onChange={(e)=>handleChangeValue(e)} placeholder="password"/>
                                        <label htmlFor="floatingPassword">New password</label>
                                        <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                              </div>
                              <div className="form-floating mb-3">
                                        <input type="password" className="form-control" id="floatingPassword" onChange={(e)=>handleChangeValue(e)} placeholder="confirm password"/>
                                        <label htmlFor="floatingPassword">Confirm password</label>
                                        <div style={error.txtConfirmPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtConfirmPassword}</div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={()=>onSubmit()}>Change password</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          </div>
          )
}
export default ChangePassword;