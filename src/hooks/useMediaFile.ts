import { MEDIA_FILES_ENDPOINT, MEDIA_BASE_URL } from "../data/constants";
import SongMedia from "../entities/SongMedia";
import axios from "axios";
import { useEffect, useState } from "react";

const useMedia = (id: string) => {
  const [media, setMedia] = useState<SongMedia | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const response = await axios.get<SongMedia>(
          `${MEDIA_BASE_URL}${MEDIA_FILES_ENDPOINT}/${id}`,
          {
            headers: {
              "x-auth-token": `${localStorage.getItem("token")}`,
            },
          }
        );
        setMedia(response.data);
      } catch (err: any) {
        console.error("Error fetching document:", err);
        if (err.response?.status === 404) {
          setError(
            "Media file not found. It may have been removed or the link is invalid."
          );
        } else {
          setError("Failed to load the document. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedia();
    }
  }, [id]);

  return { media, loading, error };
};

export default useMedia;
