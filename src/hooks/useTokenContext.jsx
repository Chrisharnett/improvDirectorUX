import { useContext } from "react";
import TokenContext from "../context/TokenContext.jsx";

export const useTokenContext = () => {
  return useContext(TokenContext);
};
