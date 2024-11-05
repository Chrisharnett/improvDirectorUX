import axios from "axios";

// This function is used to refresh the authentication tokens using the refresh token
export const updateToken = async (refreshToken) => {
  const COGNITO_DOMAIN = `${import.meta.env.VITE_COGNITO_DOMAIN}`;
  const CLIENT_ID = `${import.meta.env.VITE_COGNITO_CLIENT_ID}`;

  // The request body required by AWS Cognito to refresh tokens
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: CLIENT_ID,
    refresh_token: refreshToken,
  });

  try {
    const response = await axios.post(`${COGNITO_DOMAIN}/oauth2/token`, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Response contains the new access_token and id_token
    return response.data; // This contains { access_token, id_token }
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};
