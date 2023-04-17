import { List, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import apiClient from "../services/api-client";

interface Song {
  id: number;
  title: string;
  authora_name: string;
}

const SongGrid = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get<Song[]>("/songs")
      .then((res) => {
        // console.log(res);
        setSongs(res.data);
      })
      .catch((err) => setError(err.message));
  });

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
