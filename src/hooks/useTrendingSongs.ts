import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import Song from "../entities/Song";

const useTrendingSongs = (limit: number = 5) => {
  return useQuery({
    queryKey: ["trending-songs", limit],
    queryFn: () =>
      axiosInstance
        .get<Song[]>(`/songs/trending?limit=${limit}`)
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export default useTrendingSongs; 