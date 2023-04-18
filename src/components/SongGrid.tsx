import { List, SimpleGrid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import useSongs from "../hooks/useSongs";
import SongCard from "./SongCard";
import { Song } from "../hooks/useSongs";

const SongGrid = () => {
  const { songs, error } = useSongs();
  if (error) return <Text color="red">{error}</Text>;

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} padding="10px" spacing={10}>
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </SimpleGrid>
  );
};

export default SongGrid;
