import { createSlice } from "@reduxjs/toolkit";

const userReducer=createSlice({
          name:"user",
          initialState:{},
          reducers:{
                    loadUser:(state, action)=>{
                              const user=action.payload;
                              user.calendarMeetingIds=new Set(user.calendarMeetingIds||[]);
                              return user;
                    },
                    updateCalendarMeetingIds:(state, action)=>{
                              const meetingIds=action.payload;
                              state.calendarMeetingIds=meetingIds;
                    }
          }
})
export const {loadUser,updateCalendarMeetingIds}=userReducer.actions;
export default userReducer.reducer;