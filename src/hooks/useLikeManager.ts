import { useState, useEffect, useCallback } from "react";
import likeService, { LikeStatus } from "../services/like-service";

interface LikeManagerState {
  isLiked: boolean;
  likesCount: number;
  loading: boolean;
  error: string | null;
}

export const useLikeManager = (songId: string | undefined) => {
  const [state, setState] = useState<LikeManagerState>({
    isLiked: false,
    likesCount: 0,
    loading: false,
    error: null,
  });

  // Fetch initial like status
  const fetchLikeStatus = useCallback(async () => {
    if (!songId || songId.trim() === "") {
      setState({
        isLiked: false,
        likesCount: 0,
        loading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const likeStatus: LikeStatus = await likeService.getLikeStatus(songId);

      setState({
        isLiked: likeStatus.isLiked,
        likesCount: likeStatus.likesCount,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      console.error("Error fetching like status:", error);
      // Default to not liked if there's an error
      setState({
        isLiked: false,
        likesCount: 0,
        loading: false,
        error: error.response?.data?.message || "Failed to fetch like status",
      });
    }
  }, [songId]);

  // Like a song
  const likeSong = useCallback(async () => {
    if (!songId || songId.trim() === "" || state.loading) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Optimistically update UI
      setState((prev) => ({
        ...prev,
        isLiked: true,
        likesCount: prev.likesCount + 1,
        loading: false,
      }));

      // Make API call
      await likeService.likeSong(songId);

      // Success - state is already updated optimistically
      setState((prev) => ({ ...prev, error: null }));
    } catch (error: any) {
      console.error("Error liking song:", error);

      // Revert optimistic update on error
      await fetchLikeStatus();

      setState((prev) => ({
        ...prev,
        error: error.response?.data?.error || "Failed to like song",
        loading: false,
      }));
    }
  }, [songId, state.loading, fetchLikeStatus]);

  // Unlike a song
  const unlikeSong = useCallback(async () => {
    if (!songId || songId.trim() === "" || state.loading) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Optimistically update UI
      setState((prev) => ({
        ...prev,
        isLiked: false,
        likesCount: Math.max(0, prev.likesCount - 1),
        loading: false,
      }));

      // Make API call
      await likeService.unlikeSong(songId);

      // Success - state is already updated optimistically
      setState((prev) => ({ ...prev, error: null }));
    } catch (error: any) {
      console.error("Error unliking song:", error);

      // Revert optimistic update on error
      await fetchLikeStatus();

      setState((prev) => ({
        ...prev,
        error: error.response?.data?.error || "Failed to unlike song",
        loading: false,
      }));
    }
  }, [songId, state.loading, fetchLikeStatus]);

  // Toggle like status
  const toggleLike = useCallback(async () => {
    if (!songId || songId.trim() === "") return;

    if (state.isLiked) {
      await unlikeSong();
    } else {
      await likeSong();
    }
  }, [songId, state.isLiked, likeSong, unlikeSong]);

  // Refresh like status from server
  const refresh = useCallback(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  // Initialize on mount and when songId changes
  useEffect(() => {
    fetchLikeStatus();
  }, [fetchLikeStatus]);

  return {
    ...state,
    likeSong,
    unlikeSong,
    toggleLike,
    refresh,
  };
};

export default useLikeManager;
