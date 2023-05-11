import { Card, CardBody, HStack, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Song from "../entities/Song";
import CriticScore from "./CriticScore";

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  
  
  return (
    <Card>
      <Link to={"/songs/" + song.id}>
        <Image
          boxSize="300px"
          objectFit="cover"
          src={song.preview_image[0].preview_image}
        />
      </Link>
      <CardBody>
        <Link to={"/songs/" + song.id}>{song.title}</Link>
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
