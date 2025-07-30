import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import Song from "../entities/Song";

interface SongsResponse {
  songs: Song[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

const usePopularSongs = (limit: number = 5) => {
  return useQuery({
    queryKey: ["popular-songs", limit],
    queryFn: () =>
      axiosInstance
        .get<SongsResponse>(`/api/songs?sortOrder=-metacritic&limit=${limit}&_t=${Date.now()}`)
        .then((res) => res.data.songs),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export default usePopularSongs; 