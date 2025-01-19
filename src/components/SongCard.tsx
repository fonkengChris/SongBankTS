import { Card, CardBody, HStack, Heading, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Song from "../entities/Song";
import SongMedia from "../entities/SongMedia";
import CriticScore from "./CriticScore";
import { MEDIA_BASE_URL } from "../data/constants";

interface Props {
  song: Song;
  mediaFile: SongMedia;
}

const SongCard = ({ song, mediaFile }: Props) => {
  return (
    <Card>
      <Link to={"/media_files/" + mediaFile._id}>
        <Image
          boxSize="300px"
          objectFit="cover"
          src={MEDIA_BASE_URL + mediaFile.previewImage}
        />
      </Link>
      <CardBody>
        <Link to={"/media_files/" + mediaFile._id}>{song.title}</Link>
        <HStack justifyContent="space-between">
          <Text>{mediaFile.notation.title}</Text>
          <CriticScore score={song.metacritic ?? 0} />
        </HStack>
        {song.authorName !== "Unknown" && <Text>{song.authorName}</Text>}
      </CardBody>
    </Card>
  );
};

export default SongCard;
