import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const poolData = {
  userPoolId: import.meta.VITE_USER_POOL_ID,
  ClientId: import.meta.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

export { userPool, CognitoUser, AuthenticationDetails };
