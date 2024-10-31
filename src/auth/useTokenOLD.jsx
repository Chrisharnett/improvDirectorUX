import { useState } from "react";

export const useToken = () => {
  // Retrieve the token from sessionStorage
  const getToken = () => {
    const tokenString = sessionStorage.getItem("authToken");
    return tokenString ? JSON.parse(tokenString) : null;
  };

  // Set initial token state
  const [token, setToken] = useState(getToken());

  // Save the token in sessionStorage and update state
  const saveToken = (newToken) => {
    sessionStorage.setItem("authToken", JSON.stringify(newToken));
    setToken(newToken);
  };

  // Remove the token from sessionStorage and update state
  const removeToken = () => {
    sessionStorage.removeItem("authToken");
    setToken(null);
  };

  return [token, saveToken, removeToken];
};
