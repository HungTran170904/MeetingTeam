import { combineReducers } from "redux";
import friendsReducer from "./friendsReducer.js";
import teamsReducer from "./teamsReducer.js";
import userReducer from "./userReducer.js";
import friendRequestsReducer from "./friendRequestsReducer.js";

const rootReducer=combineReducers({
          user: userReducer,
          friends: friendsReducer,
          teams: teamsReducer,
          friendRequests: friendRequestsReducer
})
export default rootReducer;