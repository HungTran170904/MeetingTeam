import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../API/UserAPI.js";
import { loadUser } from "../../Redux/userReducer.js";
import "./User.css"
import { useSnackbar } from "notistack";
const UserSettings=()=>{
          const user=useSelector(state=>state.user);
          const dispatch=useDispatch();
          const { enqueueSnackbar } = useSnackbar();
          const [updatedUser, setUpdatedUser]=useState({...user});
          const [changedPassword, setChangedPassword]=useState(false);
          const [currentPassword, setCurrentPassword]=useState("");
          const [error,setError]=useState({txtCurrentPassword: null, txtPassword: null,txtConfirmPassword:null});
          const [file, setFile]=useState(null);
          const DisplayProfile=()=>{
                    if(file) return <img src={URL.createObjectURL(file)} width="250px" height="250px"/>
                    else if(updatedUser.urlIcon) return <img src={updatedUser.urlIcon} width="250px" height="250px"/>
                    else return <i className="fas fa-fw fa-user position-absolute top-50 start-50 translate-middle text-secondary"></i>
          }
          function handleOnChange(e, fieldName){
                    if(fieldName.search(/password/i)!=-1) setChangedPassword(true);
                    if(fieldName=="currentPassword") setCurrentPassword(e.target.value);
                    else setUpdatedUser(prev=>{
                        prev[fieldName]=e.target.value;
                        return prev;
                    })
          }
          function handlePhoneKeyPress(e){
                    if (e.which < 48 || e.which > 57) {
                              e.preventDefault();
                    }
          }
          const validatePassword = (data) => {
                    if(!changedPassword) return true;
                   var txtCurrentPassword=null, txtPassword=null, txtConfirmPassword=null;
                    if (currentPassword.trim().length == 0) {
                        txtCurrentPassword = "Current password is required";
                    } 
                    if(!data.password||data.password.trim().length==0){
                        txtPassword="New password is required";
                    }
                    if(data.confirmPassword!=data.password){
                      txtConfirmPassword="Confirm password is mismatched with password"
                    }
                    setError({txtCurrentPassword:txtCurrentPassword, txtPassword: txtPassword,txtConfirmPassword:txtConfirmPassword})
                    return !(txtCurrentPassword||txtPassword||txtConfirmPassword);
          }
          function handleSubmit(e){
                    e.preventDefault()
                    if(validatePassword(updatedUser)){
                              delete updatedUser.confirmPassword;
                              updatedUser.calendarMeetingIds=null;
                              updateUser(updatedUser, currentPassword, file).then(res=>{
                                       dispatch(loadUser(res.data));
                                       let config = {variant: 'success', anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                                       enqueueSnackbar('Update profile successfully',config)
                              })
                              .catch((err)=>{
                                    let config = {variant: 'error', anchorOrigin:{ horizontal: 'center' , vertical: 'bottom'}}
                                    let errors = err.response;
                                    if(errors==null||!errors.data) enqueueSnackbar('Unknown error',config);
                                    else enqueueSnackbar(errors.data, config);
                              })
                    }
          }
          return(
                    <div className="container">
                    <div className="row">
                                        <div className="col-12">
                                                  <div className="my-5">
                                                            <h3>My Profile</h3><hr/>
                                                  </div>
                                                  <form className="file-upload">
                                                            <div className="row mb-5 gx-5">
                                                                      <div className="col-xxl-8 mb-5 mb-xxl-0">
                                                                                <div className="bg-secondary-soft px-4 py-5 rounded">
                                                                                          <div className="row g-3">
                                                                                                    <h4 className="mb-4 mt-0">Contact detail</h4>
                                                                                                    <div className="col-md-6">
                                                                                                              <label className="form-label">Nick Name</label>
                                                                                                              <input type="text" className="form-control" defaultValue={user.nickName} onChange={(e)=>handleOnChange(e,"nickName")}/>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                              <label htmlFor="inputEmail" className="form-label">Email</label>
                                                                                                              <input type="email" className="form-control" id="inputEmail" defaultValue={user.email} onChange={(e)=>handleOnChange(e,"email")} disabled/>
                                                                                                              <div style={error.txtEmail? { display: ''} : { display: 'none' }} className="error">{error.txtEmail}</div>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                              <label className="form-label">Phone number</label>
                                                                                                              <input type="text" className="form-control" defaultValue={user.phoneNumber} onChange={(e)=>handleOnChange(e,"phoneNumber")} onKeyPress={(e)=>handlePhoneKeyPress(e)}/>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                              <label className="form-label">Birthday</label>
                                                                                                              <input type="date" className="form-control" defaultValue={user.birthday} onChange={(e)=>handleOnChange(e,"birthday")}/>
                                                                                                    </div>
                                                                                                    <h4>Change Password</h4>
                                                                                                    <div className="col-md-12">
                                                                                                              <label htmlFor="currentPassword" className="form-label">Current password</label>
                                                                                                              <input type="password" className="form-control" id="currentPassword" onChange={(e)=>handleOnChange(e,"currentPassword")} autoComplete="new-password"/>
                                                                                                              <div style={error.txtCurrentPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtCurrentPassword}</div>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                              <label htmlFor="newPassword" className="form-label">New password</label>
                                                                                                              <input type="password" className="form-control" id="newPassword" onChange={(e)=>handleOnChange(e,"password")} autoComplete="new-password"/>
                                                                                                              <div style={error.txtPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtPassword}</div>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                                                                                              <input type="password" className="form-control" id="confirmPassword" onChange={(e)=>handleOnChange(e,"confirmPassword")} autoComplete="new-password"/>
                                                                                                              <div style={error.txtConfirmPassword ? { display: ''} : { display: 'none' }} className="error">{error.txtConfirmPassword}</div>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                                      <div className="col-xxl-4">
                                                                                <div className="bg-secondary-soft px-4 py-5 rounded">
                                                                                          <div className="row g-3">
                                                                                                    <h4 className="mb-4 mt-0">Upload your profile photo</h4>
                                                                                                    <div className="text-center">
                                                                                                              <div className="square position-relative display-2 mb-3">
                                                                                                                  <DisplayProfile/> 
                                                                                                              </div>
                                                                                                              <input type="file" id="customFile" name="file" hidden="" onChange={(e)=>setFile(e.target.files[0])} style={{display: 'none'}}/>
                                                                                                              <label className="btn btn-success-soft btn-block" htmlFor="customFile">Upload</label>
                                                                                                              <p className="text-muted mt-3 mb-0"><span className="me-1">Note:</span>Minimum size 300px x 300px</p>
                                                                                                    </div>
                                                                                          </div>
                                                                                </div>
                                                                      </div>
                                                            </div>
                                                            <div className="gap-3 d-md-flex justify-content-md-end text-center">
                                                                      <button type="button" className="btn btn-primary btn-lg" onClick={(e)=>handleSubmit(e)}>Update profile</button>
                                                            </div>
                                                  </form>
                                        </div>
                              </div>
                    </div>
          )
}
export default UserSettings;