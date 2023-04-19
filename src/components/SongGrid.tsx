import { List, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import useSongs, { Notation } from "../hooks/useSongs";
import SongCard from "./SongCard";
import { Song } from "../hooks/useSongs";
import SongCardSkeleton from "./SongCardSkeleton";
import SongCardContainer from "./SongCardContainer";
import { Category } from "../hooks/useCategories";

interface Props {
  selectedCategory: Category | null;
  selectedNotation: Notation | null;
}

const SongGrid = ({ selectedCategory, selectedNotation }: Props) => {
  const {
    data: songs,
    error,
    isLoading,
  } = useSongs(selectedCategory, selectedNotation);
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
