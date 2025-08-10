import { useContext } from "react";
import AuthContext, { AuthCridentials } from "../context/AuthProvider";

const useAuth = (): AuthCridentials => {
  return useContext<AuthCridentials>(AuthContext);
};

export default useAuth;
