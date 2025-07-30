import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";

const useTrackView = () => {
  return useMutation({
    mutationFn: (songId: string) =>
      axiosInstance.post(`/api/songs/${songId}/view`),
    onError: (error) => {
      console.error("Error tracking view:", error);
    },
  });
};

export default useTrackView; 