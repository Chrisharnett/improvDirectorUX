import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { updateToken } from "../auth/token/updateToken";

const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  // Initialize tokens when the component mounts
  useEffect(() => {
    const initializeTokens = async () => {
      let token = sessionStorage.getItem("accessToken");
      if (token) {
        if (isTokenExpired(token)) {
          token = await updateRefreshToken();
        }
        setAccessToken(token);
      }
    };

    initializeTokens();
  }, []);

  // Save token utility
  const saveToken = (newTokens) => {
    if (newTokens) {
      sessionStorage.setItem("accessToken", newTokens.access_token);
      sessionStorage.setItem("idToken", newTokens.id_token);
      sessionStorage.setItem("refreshToken", newTokens.refresh_token);
      setAccessToken(newTokens.access_token);
    }
  };

  // Remove token utility
  const removeToken = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("idToken");
    setAccessToken(null);
  };

  // Function to check if a token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) {
        return true;
      }

      // Get the current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const decodedTime = decoded.exp;

      const expired = decodedTime < currentTime;

      return expired;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true;
    }
  };

  // Function to refresh token
  const updateRefreshToken = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        // Call API to refresh tokens
        const refreshedTokens = await updateToken(refreshToken);

        if (refreshedTokens) {
          // Save the new tokens
          saveToken(refreshedTokens);

          // Set the new access token in your state/context
          setAccessToken(refreshedTokens.access_token);

          return refreshedTokens.access_token;
        }
      } catch (error) {
        console.error("Failed to refresh tokens", error);
        removeToken();
      }
    }
    return null;
  };

  // Set an interval to refresh the token before it expires
  useEffect(() => {
    const refreshInterval = async () => {
      if (accessToken) {
        const decoded = jwtDecode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        const expiresIn = decoded.exp - currentTime;

        // Set a timer to refresh the token a bit before expiry (e.g., 1 minute before)
        const timer = setTimeout(async () => {
          await updateRefreshToken();
        }, (expiresIn - 60) * 1000);

        return () => clearTimeout(timer);
      }
    };

    refreshInterval();
  }, [accessToken]);

  return (
    <TokenContext.Provider
      value={{
        accessToken,
        saveToken,
        removeToken,
        isTokenExpired,
        updateRefreshToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

TokenProvider.propTypes = {
  children: PropTypes.node,
};

export default TokenContext;
