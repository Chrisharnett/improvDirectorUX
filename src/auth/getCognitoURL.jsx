const getCognitoUrl = () => {
  const callback =
    import.meta.env.VITE_ENV === "prod"
      ? import.meta.env.VITE_COGNITO_CALLBACK_PROD
      : import.meta.env.VITE_COGNITO_CALLBACK_LOCAL;

  return `${
    import.meta.env.VITE_COGNITO_DOMAIN
  }/login?response_type=code&client_id=${
    import.meta.env.VITE_COGNITO_CLIENT_ID
  }&redirect_uri=${callback}`;
};

export default getCognitoUrl;
