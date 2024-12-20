import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../hooks/useUserContext.js";
import PropTypes from "prop-types";

export const PrivateRoute = ({ redirectPath = "/", children }) => {
  const { user } = useUserContext();
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

PrivateRoute.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};
