import { useContext } from "react";
import AuthContext, { AuthCridentials } from "../context/AuthProvider";

const useAuth = () => {
  return useContext<AuthCridentials>(AuthContext);
};

export default useAuth;
