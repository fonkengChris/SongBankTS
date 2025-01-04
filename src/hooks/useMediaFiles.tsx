import { MEDIA_BASE_URL, MEDIA_FILES_ENDPOINT } from "../data/constants";
import axios from "axios";
import SongMedia from "../entities/SongMedia";

const useMediaFiles = async () => {
  try {
    const response = await axios.get<SongMedia[] | undefined>(
      `${MEDIA_BASE_URL}${MEDIA_FILES_ENDPOINT}`,
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

export default useMediaFiles;
