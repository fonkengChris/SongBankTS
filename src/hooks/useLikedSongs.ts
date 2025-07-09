import { useState, useEffect } from "react";
import likeService, { LikedSongsResponse } from "../services/like-service";

export const useLikedSongs = (
  page: number = 1,
  limit: number = 10,
  includeMediaFiles: boolean = true
) => {
  const [likedSongs, setLikedSongs] = useState<LikedSongsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await likeService.getLikedSongs(page, limit);
      setLikedSongs(response);
    } catch (error: any) {
      console.error("Error fetching liked songs:", error);
      setError(error.response?.data?.message || "Failed to fetch liked songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, [page, limit]);

  const refetch = () => {
    fetchLikedSongs();
  };

  return { likedSongs, loading, error, refetch };
};

export default useLikedSongs;
