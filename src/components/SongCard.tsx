import { Card, CardBody, HStack, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Song from "../entities/Song";
import CriticScore from "./CriticScore";
import { MEDIA_BASE_URL } from "../data/constants";

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  return (
    <Card>
      <Link to={"/songs/" + song._id}>
        <Image
          boxSize="300px"
          objectFit="cover"
          src={MEDIA_BASE_URL + song.documentFiles[0].previewImage}
        />
      </Link>
      <CardBody>
        <Link to={"/songs/" + song._id}>{song.title}</Link>
        <HStack justifyContent="space-between">
          <Text>{song.documentFiles[0].notation.title}</Text>
          <CriticScore score={song.metacritic} />
        </HStack>
        {song.author_name !== "Unknown" && <Text>{song.author_name}</Text>}
      </CardBody>
    </Card>
  );
};

export default SongCard;
