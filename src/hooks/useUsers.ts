import { USERS_ENDPOINT, MEDIA_BASE_URL } from "../data/constants";
import User from "../entities/User";
import axios from "axios";

const useUsers = async () => {
  try {
    const response = await axios.get<User[] | undefined>(
      `${MEDIA_BASE_URL}${USERS_ENDPOINT}`,
      {
        headers: {
          "x-auth-token": `${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Error fetching document:", err);
  }
};

export default useUsers;
