import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import useCustomer from "./useCustomer";
import JWT_User from "../entities/JWT_User";

const useUserProfile = () => {
  const user = jwtDecode<JWT_User>(localStorage.getItem("token")!);
  //   console.log(user);
  return user;
};

export default useUserProfile;
