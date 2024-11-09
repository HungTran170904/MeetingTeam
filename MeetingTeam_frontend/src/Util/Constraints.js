import env from "react-dotenv";

export const API_ENDPOINT = env.API_ENDPOINT
export const WEBSOCKET_ENDPOINT=API_ENDPOINT+"/wss"
export const tabTitles=["Members", "Pending Requests", "Channels","Settings"]