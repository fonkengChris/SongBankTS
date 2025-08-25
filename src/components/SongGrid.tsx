import { SimpleGrid, Text, Box, Spinner, VStack } from "@chakra-ui/react";
import useSongs from "../hooks/useSongs";
import usePurchases from "../hooks/usePurchases";
import SongCard from "./SongCard";
import PremiumSongCard from "./PremiumSongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { useEffect, useRef } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import Song from "../entities/Song";
import { hasUserPurchased } from "../utils/purchase-utils";

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

  const { data: purchases, isLoading: isLoadingPurchases } = usePurchases();

  // Create base song object
  const dummySong: Partial<Song> = {
    _id: "premium-1",
    title: "Premium Song",
    slug: "premium-song",
    lyrics: "Premium lyrics",
    language: { _id: "1", name: "English", code: "en" },
    authorName: "Premium Author",
    description: "This is a premium song",
    mediaFiles: [],
  };

  // Add media files with song reference
  dummySong.mediaFiles = [
    {
      _id: "premium-media-1",
      name: "Premium Media",
      song: dummySong as Song,
      notation: { _id: "1", title: "Standard", slug: "standard" },
      previewImage: "https://placehold.co/600x400?text=Premium+Content",
      documentFile: "",
      audioFile: "",
    },
  ];

  const dummyPremiumSong = dummySong as Song;

  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) return <Text color="red">{error.message}</Text>;

  // Helper function to determine which card to show
  const shouldShowPremiumCard = (song: Song, mediaFileId: string) => {
    // If the song has a price, check if user has purchased it
    if (song.price && song.price > 0) {
      // If purchases are still loading, show premium card to be safe
      if (isLoadingPurchases) {
        return true;
      }
      // Check if user has purchased this specific media file
      return !hasUserPurchased(mediaFileId, purchases || []);
    }
    // Free songs always show as regular cards
    return false;
  };

  return (
    <VStack spacing={6} width="100%">
      <Box
        display="grid"
        gridTemplateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(4, 1fr)"
        }}
        gap={{ base: 4, md: 6 }}
        width="100%"
        maxW="100%"
      >
        {/* Regular songs */}
        {isLoading &&
          skeletons.map((skeleton) => (
            <SongCardContainer key={skeleton}>
              <SongCardSkeleton />
            </SongCardContainer>
          ))}
        {data?.pages.map((page, pageIndex) =>
          page.songs?.map((song) =>
            song.mediaFiles.map((mediaFile) => (
              <SongCardContainer key={`${pageIndex}-${mediaFile._id}`}>
                {shouldShowPremiumCard(song, mediaFile._id) ? (
                  <PremiumSongCard song={song} mediaFile={mediaFile} />
                ) : (
                  <SongCard song={song} mediaFile={mediaFile} />
                )}
              </SongCardContainer>
            ))
          )
        )}
      </Box>

      <Box ref={loadMoreRef} padding="20px" textAlign="center" width="100%">
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
          <Text color="gray.600" fontSize={{ base: "sm", md: "md" }}>
            No more songs to load.
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default SongGrid;
