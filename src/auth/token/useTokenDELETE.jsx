import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { updateToken as refreshTokenRequest } from "./updateToken";

export const useTokenOLD = () => {
  // Initialize token state from sessionStorage
  const getStoredToken = () => sessionStorage.getItem("accessToken") || null;
  const getStoredRefreshToken = () =>
    sessionStorage.getItem("refreshToken") || null;

  const [accessToken, setAccessToken] = useState(getStoredToken());
  const [refreshToken, setRefreshToken] = useState(getStoredRefreshToken());

  // Save token utility
  const saveToken = (newTokens) => {
    if (newTokens) {
      sessionStorage.setItem("accessToken", newTokens.access_token);
      sessionStorage.setItem("idToken", newTokens.id_token);
      sessionStorage.setItem("refreshToken", newTokens.refresh_token);
      setAccessToken(newTokens.access_token);
      setRefreshToken(newTokens.refresh_token);
    }
  };

  // Remove token utility
  const removeToken = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("idToken");
    setAccessToken(null);
    setRefreshToken(null);
  };

  // Function to check if a token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const expireTime = decoded.exp;
      const expired = expireTime < currentTime;
      // console.log("Token expired:", expired);
      return expired;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true;
    }
  };

  // Function to refresh token
  const refreshTokens = async () => {
    if (refreshToken) {
      try {
        const refreshedTokens = await refreshTokenRequest(refreshToken);
        if (refreshedTokens) {
          saveToken(refreshedTokens);
        }
      } catch (error) {
        console.error("Failed to refresh tokens", error);
        removeToken(); // Remove tokens if refresh fails
      }
    }
  };

  // Refresh token when the component mounts
  useEffect(() => {
    if (accessToken && isTokenExpired(accessToken) && refreshToken) {
      refreshTokens();
    }
  }, []);

  // Set an interval to refresh the token before it expires
  useEffect(() => {
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - currentTime;

      // Set a timer to refresh the token a bit before expiry (e.g., 1 minute before)
      const timer = setTimeout(() => {
        refreshTokens();
      }, (expiresIn - 60) * 1000);

      return () => clearTimeout(timer);
    }
  }, [accessToken]);

  return { accessToken, refreshTokens, saveToken, removeToken, isTokenExpired };
};
