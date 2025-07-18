import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { VIDEOS_ENDPOINT } from "../data/constants";
import APIClient from "../services/api-client";
import Video from "../entities/Video";

const apiClient = new APIClient<Video>(VIDEOS_ENDPOINT);

interface VideoQuery {
  level?: string;
  sortOrder?: string;
}

interface VideoPaginatedResponse {
  videos: Video[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

const useVideos = (videoQuery: VideoQuery = {}) => {
  return useInfiniteQuery<VideoPaginatedResponse, Error>({
    queryKey: ["videos", videoQuery],
    queryFn: ({ pageParam = 1 }) =>
      apiClient
        .getAllSongs({
          params: {
            page: pageParam,
            ...videoQuery,
          },
        })
        .then((response: any) => ({
          videos: response.videos || [],
          pagination: response.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            hasMore: false,
          },
        })),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.pagination.hasMore ? allPages.length + 1 : undefined;
    },
    cacheTime: 0,
  });
};

// Hook for admin pages that need all videos without pagination
const useAllVideos = () => {
  return useQuery<Video[], Error>({
    queryKey: ["all-videos"],
    queryFn: () => apiClient.getAllSongsWithoutPagination(),
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for getting a single video by ID
const useVideo = (id?: string) => {
  console.log("useVideo hook called with id:", id);
  
  return useQuery<Video, Error>({
    queryKey: ["video", id],
    queryFn: () => {
      console.log("useVideo queryFn called with id:", id);
      return apiClient.get(id!);
    },
    enabled: !!id, // Only run the query if id is provided
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });
};

export { useAllVideos, useVideo };
export default useVideos;
 