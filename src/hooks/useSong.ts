import Song from "../entities/Song";
import { MEDIA_BASE_URL, SONGS_ENDPOINT } from "../data/constants";
import axios from "axios";
import { useState, useEffect } from "react";

const useSong = (id: string) => {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Song>(
          `${MEDIA_BASE_URL}${SONGS_ENDPOINT}/${id}`,
          {
            headers: {
              "x-auth-token": `${localStorage.getItem("token")}`,
            },
          }
        );
        setSong(response.data);
      } catch (err) {
        setError("Failed to load the document. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSong();
    }
  }, [id]);

  return { song, loading, error };
};

export default useSong;
