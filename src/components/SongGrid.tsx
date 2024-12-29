import { SimpleGrid, Text } from "@chakra-ui/react";
import useSongs from "../hooks/useSongs";
import SongCard from "./SongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { useState } from "react";

const SongGrid = () => {
  const { data: songs, error, isLoading } = useSongs();
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (error) return <Text color="red">{error.message}</Text>;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 5 }} padding="10px" spacing={3}>
      {isLoading &&
        skeletons.map((skeleton) => (
          <SongCardContainer key={skeleton}>
            <SongCardSkeleton />
          </SongCardContainer>
        ))}
      {songs?.map((song) =>
        song.mediaFiles.map((mediaFile) => (
          <SongCardContainer key={mediaFile._id}>
            <SongCard song={song} mediaFile={mediaFile} />
          </SongCardContainer>
        ))
      )}
    </SimpleGrid>
  );
};

export default SongGrid;
