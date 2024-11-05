import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { useToken } from "../auth/token/useTokenDELETE";
import { useTokenContext } from "../hooks/useTokenContext";

// Creating UserContext
export const UserContext = createContext();

// Creating the UserProvider component
export const UserProvider = ({ children }) => {
  const { accessToken, refreshTokens, saveToken, removeToken, isTokenExpired } =
    useTokenContext();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState({});

  // Function to extract payload from a JWT token
  const getPayloadFromToken = (jwtToken) => {
    if (!jwtToken || typeof jwtToken !== "string") {
      return null;
    }

    try {
      const parts = jwtToken.split(".");
      if (parts.length !== 3) {
        return null;
      }

      const encodedPayload = parts[1];
      const decodedPayload = atob(encodedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Update user state whenever accessToken changes
  useEffect(() => {
    if (accessToken) {
      const userInfo = getPayloadFromToken(accessToken);
      setUser(userInfo);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [accessToken]);

  const updateCurrentPlayer = (updates) => {
    setCurrentPlayer((prevPlayer) => ({
      ...prevPlayer,
      ...updates,
    }));
  };

  const resetPlayer = () => {
    updateCurrentPlayer({ currentPrompts: [], finalPrompt: "" });
  };

  const removeUser = () => {
    setUser(null);
    removeToken();
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        removeUser,
        loading,
        currentPlayer,
        setCurrentPlayer,
        updateCurrentPlayer,
        resetPlayer,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
};
