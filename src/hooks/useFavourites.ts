import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import favouriteService from "../services/favouriteService";
import { FavouriteResponse } from "../entities/Favourite";

export const useFavourites = (page: number = 1, limit: number = 50) => {
  return useQuery<FavouriteResponse>({
    queryKey: ["favourites", page, limit],
    queryFn: () => favouriteService.getFavourites(page, limit, true), // Include media files
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFavouriteStatus = (songId: string | undefined) => {
  return useQuery({
    queryKey: ["favouriteStatus", songId],
    queryFn: () => favouriteService.getFavouriteStatus(songId!),
    enabled: !!songId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useToggleFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ songId, isFavourited }: { songId: string; isFavourited: boolean }) => {
      if (isFavourited) {
        return favouriteService.removeFavourite(songId);
      } else {
        return favouriteService.addFavourite(songId);
      }
    },
    onMutate: async ({ songId, isFavourited }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["favouriteStatus", songId] });
      await queryClient.cancelQueries({ queryKey: ["songs"] });

      // Snapshot the previous values
      const previousStatus = queryClient.getQueryData(["favouriteStatus", songId]);
      const previousSongs = queryClient.getQueryData(["songs"]);

      // Optimistically update the favourite status
      queryClient.setQueryData(["favouriteStatus", songId], (old: any) => ({
        ...old,
        isFavourited: !isFavourited,
        favouritesCount: old?.favouritesCount ? (isFavourited ? old.favouritesCount - 1 : old.favouritesCount + 1) : (isFavourited ? 0 : 1)
      }));

      // Optimistically update songs data to reflect favouritesCount change
      queryClient.setQueriesData({ queryKey: ["songs"] }, (old: any) => {
        if (!old) return old;
        
        // Handle different response structures
        if (old.pages) {
          // Paginated response
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              songs: page.songs?.map((song: any) => 
                song._id === songId 
                  ? { 
                      ...song, 
                      favouritesCount: (song.favouritesCount || 0) + (isFavourited ? -1 : 1)
                    }
                  : song
              ) || []
            }))
          };
        } else if (Array.isArray(old)) {
          // Array response
          return old.map((song: any) => 
            song._id === songId 
              ? { 
                  ...song, 
                  favouritesCount: (song.favouritesCount || 0) + (isFavourited ? -1 : 1)
                }
              : song
          );
        } else if (old.songs) {
          // Object with songs property
          return {
            ...old,
            songs: old.songs.map((song: any) => 
              song._id === songId 
                ? { 
                    ...song, 
                    favouritesCount: (song.favouritesCount || 0) + (isFavourited ? -1 : 1)
                  }
                : song
            )
          };
        }
        
        return old;
      });

      // Return context with snapshots
      return { previousStatus, previousSongs };
    },
    onError: (err, variables, context) => {
      // Rollback optimistic updates on error
      if (context?.previousStatus) {
        queryClient.setQueryData(["favouriteStatus", variables.songId], context.previousStatus);
      }
      if (context?.previousSongs) {
        queryClient.setQueryData(["songs"], context.previousSongs);
      }
      console.error("Error toggling favourite:", err);
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["favouriteStatus", variables.songId] });
      queryClient.invalidateQueries({ queryKey: ["favourites"] });
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
  });
};
