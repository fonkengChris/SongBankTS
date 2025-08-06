import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import { hasViewedSong, addViewedSong } from "../utils/view-tracking";

const useTrackView = () => {
  return useMutation({
    mutationFn: (songId: string) =>
      axiosInstance.post(`/api/songs/${songId}/view`),
    onError: (error) => {
      console.error("Error tracking view:", error);
    },
  });
};

// Enhanced view tracking with session-based deduplication
export const useEnhancedTrackView = () => {
  const trackView = useMutation({
    mutationFn: (songId: string) =>
      axiosInstance.post(`/api/songs/${songId}/view`),
    onError: (error) => {
      console.error("Error tracking view:", error);
    },
  });

  const trackViewOnce = (songId: string) => {
    // Check if we've already tracked this view in this session
    if (!hasViewedSong(songId)) {
      // Track the view
      trackView.mutate(songId, {
        onSuccess: () => {
          // Only add to viewed songs list if the API call was successful
          addViewedSong(songId);
        }
      });
    }
  };

  return {
    trackViewOnce,
    isLoading: trackView.isLoading,
    error: trackView.error,
  };
};

export default useTrackView; 