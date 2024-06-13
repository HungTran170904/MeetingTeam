import { useEffect, useState } from "react"
import { generateToken } from "../../API/MeetingAPI.js";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from "react-redux";
var meetingId;
const ZegoMeeting=()=>{
         const [data, setData]=useState(null);
         const user=useSelector(state=>state.user);
         const meetingId=getMeetingId();
          useEffect(()=>{
                    if(meetingId) generateToken(meetingId)
                                        .then(res=>{
                                                 const returnedData=res.data;
                                                 returnedData.user=JSON.parse(returnedData.user);
                                                 setData(returnedData);
                                        })
                                        .catch(err=>alert(err));
          },[]); 
          function getMeetingId() {
                    let urlStr = window.location.href.split('?')[1];
                    const urlSearchParams = new URLSearchParams(urlStr);
                    const result = Object.fromEntries(urlSearchParams.entries());
                    return result["meetingId"];
          }   
          const videoConference=async(element)=>{
                    const kitToken= ZegoUIKitPrebuilt.generateKitTokenForProduction(
                              data.appId,
                              data.token, 
                              meetingId, 
                              data.user.id, 
                              data.user.nickName
                          );
                    console.log("KitToken",kitToken);
                    // Create instance object from Token.
                    const zp = ZegoUIKitPrebuilt.create(kitToken);
                    // start the call
                    zp.joinRoom({
                              container: element,
                              sharedLinks: [
                                        {
                                        name: 'Personal link',
                                        url: window.location.protocol + '//' +window.location.host 
                                                  + window.location.pathname +'?meetingId=' +meetingId
                                        },
                              ],
                              scenario: {
                                        mode: ZegoUIKitPrebuilt.VideoConference
                              },
                              turnOnMicrophoneWhenJoining: true,
                              turnOnCameraWhenJoining: true,
                              showMyCameraToggleButton: true,
                              showMyMicrophoneToggleButton: true,
                              showAudioVideoSettingsButton: true,
                              showScreenSharingButton: true,
                              showTextChat: true,
                              showUserList: true,
                              maxUsers: 50,
                              layout: "Sidebar",
                              showLayoutButton: true,
                    });
          }     
          return(
                    <>
                        {data&&<div className="myCallContainer" 
                                        ref={videoConference}
                                        style={{ width: '100vw', height: '100vh' }}
                        ></div>}
                    </>
          )
}
export default ZegoMeeting;