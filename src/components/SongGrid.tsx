import { SimpleGrid, Text, Box, Spinner } from "@chakra-ui/react";
import useSongs from "../hooks/useSongs";
import SongCard from "./SongCard";
import PremiumSongCard from "./PremiumSongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { useEffect, useRef } from "react";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import Song from "../entities/Song";

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

  return (
    <Box padding="10px">
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={6}
        padding="10px"
      >
        {/* Regular songs */}
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
                {song.price ? (
                  <PremiumSongCard song={song} mediaFile={mediaFile} />
                ) : (
                  <SongCard song={song} mediaFile={mediaFile} />
                )}
              </SongCardContainer>
            ))
          )
        )}
      </SimpleGrid>

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
