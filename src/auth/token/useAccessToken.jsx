import { useToken } from "./useTokenDELETE";

const useAccessToken = () => {
  const { accessToken, refreshTokens, isTokenExpired } = useToken();

  const getAccessToken = async () => {
    let currentToken = accessToken;
    if (!currentToken) {
      currentToken = sessionStorage.getItem("accessToken");
    }
    if (accessToken && isTokenExpired(accessToken)) {
      await refreshTokens();
    }
    return currentToken;
  };
  return { getAccessToken };
};

export default useAccessToken;
