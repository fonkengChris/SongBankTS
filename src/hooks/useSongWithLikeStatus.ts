import { useState, useEffect } from "react";
import likeService, { SongWithLikeStatus } from "../services/like-service";

export const useSongWithLikeStatus = (songId: string | undefined) => {
  const [song, setSong] = useState<SongWithLikeStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSongWithLikeStatus = async () => {
    if (!songId || songId.trim() === "") {
      setSong(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await likeService.getSongWithLikeStatus(songId);
      setSong(response);
    } catch (error: any) {
      console.error("Error fetching song with like status:", error);
      setError(error.response?.data?.message || "Failed to fetch song");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongWithLikeStatus();
  }, [songId]);

  const refetch = () => {
    fetchSongWithLikeStatus();
  };

  return { song, loading, error, refetch };
};

export default useSongWithLikeStatus;
