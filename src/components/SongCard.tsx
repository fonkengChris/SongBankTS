import React from "react";
import { Song } from "../hooks/useSongs";
import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
// import PlatformIconList from "./PlatformIconList";
// import CriticScore from "./CriticScore";
// import getCroppedImageUrl from "../services/image-urls";
// import Emoji from "./Emoji";

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  return (
    <Card boxSize="500px" borderRadius={10} overflow="hidden">
      <Image
        boxSize="400px"
        objectFit="cover"
        src={song.preview_image[0].preview_image}
      />
      <CardBody>
        <Heading fontSize="2xl">{song.title}</Heading>
        <Text>{song.notation.title}</Text>
        {song.author_name !== "Unknown" && <Text>{song.author_name}</Text>}
      </CardBody>
    </Card>
  );
};

export default SongCard;
