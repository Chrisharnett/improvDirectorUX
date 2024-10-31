import { useContext } from "react";
import { WebSocketContext } from "./WebSocketContext";

const useWebSocket = () => useContext(WebSocketContext);

export default useWebSocket;
