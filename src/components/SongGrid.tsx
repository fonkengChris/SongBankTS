import { SimpleGrid, Text } from "@chakra-ui/react";
import useSongs, { Notation } from "../hooks/useSongs";
import SongCard from "./SongCard";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { Category } from "../hooks/useCategories";
import { SongQuery } from "../App";

interface Props {
  songQuery: SongQuery;
}

const SongGrid = ({ songQuery }: Props) => {
  const {
    data: songs,
    error,
    isLoading,
  } = useSongs(songQuery);
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  if (error) return <Text color="red">{error}</Text>;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 5 }} padding="10px" spacing={3}>
      {isLoading &&
        skeletons.map((skeleton) => (
          <SongCardContainer key={skeleton}>
            <SongCardSkeleton />
          </SongCardContainer>
        ))}
      {songs.map((song) => (
        <SongCardContainer key={song.id}>
          <SongCard song={song} />
        </SongCardContainer>
      ))}
    </SimpleGrid>
  );
};

export default SongGrid;
