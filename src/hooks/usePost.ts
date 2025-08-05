import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/api-client";
import { Post } from "./usePosts";

const usePost = (slug: string) => {
  const queryClient = useQueryClient();

  const {
    data: post,
    isLoading,
    error,
    refetch,
  } = useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: () =>
      axiosInstance
        .get(`/api/posts/slug/${slug}`)
        .then((res: any) => res.data),
    enabled: !!slug,
  });

  return {
    post,
    isLoading,
    error,
    refetch,
  };
};

export default usePost; 