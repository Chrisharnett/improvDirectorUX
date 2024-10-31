import { Navigate, Outlet } from "react-router-dom";
import useUser from "./useUserOLD";
import PropTypes from "prop-types";

export const PrivateRoute = ({ redirectPath = "/", children }) => {
  const user = useUser();
  if (!user) return <Navigate to={redirectPath} replace />;

  return children ? children : <Outlet />;
};

PrivateRoute.propTypes = {
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};
