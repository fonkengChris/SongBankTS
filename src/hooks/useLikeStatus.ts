import { useState, useEffect } from "react";
import likeService, { LikeStatus } from "../services/like-service";

export const useLikeStatus = (songId: string | undefined) => {
  const [likeStatus, setLikeStatus] = useState<LikeStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkLikeStatus = async () => {
    if (!songId || songId.trim() === "") {
      setLikeStatus({
        isLiked: false,
        songId: "",
        likesCount: 0,
      });
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await likeService.getLikeStatus(songId);
      setLikeStatus(response);
    } catch (error: any) {
      console.error("Error checking like status:", error);
      // If user is not authenticated or song doesn't exist, default to not liked
      setLikeStatus({
        isLiked: false,
        songId,
        likesCount: 0,
      });
      setError(error.response?.data?.message || "Failed to check like status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLikeStatus();
  }, [songId]);

  const refetch = () => {
    checkLikeStatus();
  };

  return { likeStatus, loading, error, refetch };
};

export default useLikeStatus;
