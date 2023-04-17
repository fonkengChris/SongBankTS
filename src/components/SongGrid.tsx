import { List, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import useSongs from "../hooks/useSongs";

interface Song {
  id: number;
  title: string;
  authora_name: string;
}

const SongGrid = () => {
  const { songs, error } = useSongs();
  if (error) return <Text color="red">{error}</Text>;

  return (
    <List>
      {songs.map((song) => (
        <li key={song.id}>{song.title}</li>
      ))}
    </List>
  );
};

export default SongGrid;
