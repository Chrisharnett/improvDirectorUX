import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WebSocketProvider } from "./util/WebSocketContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { TokenProvider } from "./context/TokenContext.jsx";

const websocketURL =
  import.meta.env.VITE_ENV === "prod"
    ? import.meta.env.VITE_WEBSOCKET_API_PROD
    : import.meta.env.VITE_WEBSOCKET_API_LOCAL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TokenProvider>
      <UserProvider>
        <WebSocketProvider url={websocketURL}>
          <App />
        </WebSocketProvider>
      </UserProvider>
    </TokenProvider>
  </StrictMode>
);
