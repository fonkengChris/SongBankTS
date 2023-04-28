import { REFRESH_TOKEN_ENDPOINT } from "../data/constants";
import { axiosInstance } from "../services/api-client";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { auth, setAuth } = useAuth();

  const refreshToken = localStorage.getItem("tokenRef");

  const refresh = async () => {
    const response = await axiosInstance.post(REFRESH_TOKEN_ENDPOINT, {
      refresh: refreshToken,
    });
    setAuth({ ...auth, access: response.data.access });
    // console.log(response.data.access);
    return response.data.access;
  };
  return refresh;
};

export default useRefreshToken;
