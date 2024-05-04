import { useState } from "react";
import { activateUser, sendOTPcode } from "../../API/AuthAPI.js";
import { useNavigate } from "react-router-dom";

const AccountActivation=()=>{
          const navigate = useNavigate();
          const [data, setData]=useState({
                    email:"",
                    OTPcode:""
          })
          const [error, setError]=useState("");
          function handleChangeValue(e, fieldName){
                    setData(prev=>{
                      prev[fieldName]=e.target.value;
                      return prev;
                    });
          }
          function handleOTPbutton(e){
                    e.preventDefault();
                    if (data.email&&data.email.trim().length == 0) {
                      setError("Email is required");
                  }
                    sendOTPcode(data.email).catch(err=>setError(err.response.data));
          }
          function onSubmit(e){
                    e.preventDefault();
                    activateUser(data.email, data.OTPcode).then(res=>{
                              alert("Activate account successfully");
                              navigate("/login");
                    })
          }
          return(
                    <div className="container">
                    <div className="row">
                      <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                          <div className="card-body p-4 p-sm-5">
                            <h3 className="card-title text-center mb-5 fw-light fs-5">Enter email and activate account</h3>
                            <div>
                              <div className="form-floating mb-3">
                                        <input type="email" className="form-control" id="floatingInput" placeholder="email" onChange={(e)=>handleChangeValue(e,"email")}/>
                                        <label htmlFor="floatingInput">Email</label>
                              </div>
                              <div className="mb-3">
                                        <div className="input-group">
                                                  <input type="text" className="form-control" placeholder="Enter OTP code" onChange={(e)=>handleChangeValue(e,"OTPcode")}/>
                                                  <button className="btn btn-success" id="otp" onClick={(e)=>handleOTPbutton(e)}>Send OTP code</button>
                                        </div>
                                        <div style={error? { display: ''} : { display: 'none' }} className="error">{error}</div>
                              </div>
                              <div className="d-grid">
                                <button className="btn btn-primary btn-login text-uppercase fw-bold" onClick={(e)=>onSubmit(e)}>Activate account</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
          </div>  
          )
}
export default AccountActivation;