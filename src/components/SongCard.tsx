import React from "react";
import { Song } from "../hooks/useSongs";
import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
import CriticScore from "./CriticScore";
import SongCardContainer from "./SongCardContainer";
// import PlatformIconList from "./PlatformIconList";
// import CriticScore from "./CriticScore";
// import getCroppedImageUrl from "../services/image-urls";
// import Emoji from "./Emoji";

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  return (
    <Card>
      <Image
        boxSize="300px"
        objectFit="cover"
        src={song.preview_image[0].preview_image}
      />
      <CardBody>
        <Heading fontSize="2xl">{song.title}</Heading>
        <HStack justifyContent="space-between">
          <Text>{song.notation.title}</Text>
          <CriticScore score={song.metacritic} />
        </HStack>
        {song.author_name !== "Unknown" && <Text>{song.author_name}</Text>}
      </CardBody>
    </Card>
  );
};

export default SongCard;
