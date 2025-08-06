import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
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

  // Use ref to track which songs we've already attempted to view in this session
  const attemptedViews = useRef<Set<string>>(new Set());
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const trackViewOnce = useCallback((songId: string) => {
    // Check if we've already attempted to track this view in this session
    if (attemptedViews.current.has(songId)) {
      return; // Already attempted, don't try again
    }

    // Check if we've already successfully tracked this view in localStorage
    if (hasViewedSong(songId)) {
      return; // Already tracked successfully, don't try again
    }

    // Clear any existing debounce timer for this song
    const existingTimer = debounceTimers.current.get(songId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set a new debounce timer
    const timer = setTimeout(() => {
      // Mark this song as attempted
      attemptedViews.current.add(songId);
      
      // Remove the timer from the map
      debounceTimers.current.delete(songId);

      // Track the view
      trackView.mutate(songId, {
        onSuccess: () => {
          // Only add to viewed songs list if the API call was successful
          addViewedSong(songId);
        }
      });
    }, 1000); // 1 second debounce

    debounceTimers.current.set(songId, timer);
  }, [trackView]);

  return {
    trackViewOnce,
    isLoading: trackView.isLoading,
    error: trackView.error,
  };
};

export default useTrackView; 