import { createContext, useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children, url }) => {
  const [socket, setSocket] = useState(null);
  const [incomingMessage, setIncomingMessage] = useState("");
  const [ready, setReady] = useState(false);
  const reconnectInterval = useRef(null);
  const reconnectDelay = useRef(1000); // Start with 1 second (1000 ms)
  const maxReconnectDelay = 60000; // Max delay is 60 seconds (1 minute)
  const isManuallyClosed = useRef(false);
  const isConnecting = useRef(false); // To prevent duplicate connections

  const connectWebSocket = () => {
    if (isConnecting.current || socket) {
      // WebSocket is already connecting or connected
      return;
    }

    isConnecting.current = true;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      clearInterval(reconnectInterval.current);
      reconnectDelay.current = 1000;
      isManuallyClosed.current = false;
      isConnecting.current = false;
      setReady(true);
    };

    ws.onmessage = (event) => {
      const message = event.data;
      try {
        const data = JSON.parse(message);

        if (data.action === "ping") {
          ws.send(JSON.stringify({ action: "pong" }));
        } else {
          setIncomingMessage(message);
        }
      } catch (error) {
        console.error("Failed to parse message:", message);
      }
    };

    ws.onclose = () => {
      setReady(false);
      isConnecting.current = false; // Reset flag on close
      if (!isManuallyClosed.current) {
        reconnectWebSocket(); // Reconnect when the connection closes
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnecting.current = false; // Reset flag on error
    };

    setSocket(ws);
  };

  const disconnectWebSocket = () => {
    if (socket) {
      isManuallyClosed.current = true; // Mark the socket as manually closed to prevent reconnect
      socket.close(); // Close the WebSocket connection
      setReady(false); // Update ready state to false
      setSocket(null); // Remove the reference to the closed socket
    }
  };

  const reconnectWebSocket = () => {
    reconnectInterval.current = setTimeout(() => {
      console.log(
        `Attempting to reconnect in ${reconnectDelay.current / 1000} seconds...`
      );
      connectWebSocket();
      reconnectDelay.current = Math.min(
        reconnectDelay.current * 2,
        maxReconnectDelay
      ); // Exponential backoff
    }, reconnectDelay.current);
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      isManuallyClosed.current = true;
      if (socket) socket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error(
        "WebSocket is not open. Ready state:",
        socket ? socket.readyState : "No socket"
      );
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        sendMessage,
        incomingMessage,
        ready,
        connectWebSocket,
        disconnectWebSocket,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.node.isRequired,
  url: PropTypes.string.isRequired,
};

export { WebSocketContext };
