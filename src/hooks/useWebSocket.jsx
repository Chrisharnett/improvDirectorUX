import { useContext } from "react";
import { WebSocketContext } from "../util/WebSocketContext";

const useWebSocket = () => useContext(WebSocketContext);

export default useWebSocket;
