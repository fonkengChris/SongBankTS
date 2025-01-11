import { SimpleGrid, Text, Box, Spinner } from "@chakra-ui/react";
import useSongs from "../hooks/useSongs";
import SongCard from "./SongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { useEffect, useRef } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

const SongGrid = () => {
  const loadMoreRef = useRef(null);
  const isIntersecting = useIntersectionObserver(loadMoreRef);

  const {
    data,
    error,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSongs();

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) return <Text color="red">{error.message}</Text>;

  return (
    <Box>
      <SimpleGrid columns={{ sm: 1, md: 2, lg: 5 }} padding="10px" spacing={3}>
        {isLoading &&
          skeletons.map((skeleton) => (
            <SongCardContainer key={skeleton}>
              <SongCardSkeleton />
            </SongCardContainer>
          ))}
        {data?.pages.map((page, pageIndex) =>
          page.songs.map((song) =>
            song.mediaFiles.map((mediaFile) => (
              <SongCardContainer key={`${pageIndex}-${mediaFile._id}`}>
                <SongCard song={song} mediaFile={mediaFile} />
              </SongCardContainer>
            ))
          )
        )}
      </SimpleGrid>

      {/* Loading indicator and intersection observer target */}
      <Box ref={loadMoreRef} padding="20px" textAlign="center">
        {isFetchingNextPage && (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="md"
          />
        )}
        {!hasNextPage && (data?.pages?.length ?? 0) > 0 && (
          <Text color="gray.600">No more songs to load.</Text>
        )}
      </Box>
    </Box>
  );
};

export default SongGrid;
