import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
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
        <Image boxSize="300px" objectFit="cover" src={mediaFile.previewImage} />
      </Link>
      <CardBody>
        <Link to={"/media_files/" + mediaFile._id}>{mediaFile.name}</Link>
        <Text mt={1}>{mediaFile.notation?.title || "No notation"}</Text>
        <Text>{song.authorName !== "Unknown" && song.authorName}</Text>
        <HStack justifyContent="space-between" mt={2}>
          <CriticScore score={song.metacritic ?? 0} />
          <Text color="green.500" fontWeight="bold">
            Free
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default SongCard;
