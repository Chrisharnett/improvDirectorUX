const getCognitoUrl = () => {
  const callback =
    import.meta.env.REACT_APP_ENV === "prod"
      ? import.meta.env.REACT_APP_COGNITO_CALLBACK_PROD
      : import.meta.env.REACT_APP_COGNITO_CALLBACK_LOCAL;

  return `${
    import.meta.env.REACT_APP_COGNITO_DOMAIN
  }/login?response_type=code&client_id=${
    import.meta.env.REACT_APP_CLIENT_ID
  }&redirect_uri=${callback}`;
};

export default getCognitoUrl;
