import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Text,
  Button,
  useDisclosure,
  Box,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LockIcon } from "@chakra-ui/icons";
import Song from "../entities/Song";
import SongMedia from "../entities/SongMedia";
import PurchaseModal from "./PurchaseModal";
import CriticScore from "./CriticScore";
import { MEDIA_BASE_URL } from "../data/constants";

interface Props {
  song: Song;
  mediaFile: SongMedia;
}

const PremiumSongCard = ({ song, mediaFile }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onOpen();
  };

  return (
    <>
      <Card>
        <Box position="relative">
          <Link to={`/media_files/${mediaFile._id}`} onClick={handleClick}>
            <Image
              boxSize="300px"
              objectFit="cover"
              src={mediaFile.previewImage}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              display="flex"
              alignItems="center"
              justifyContent="center"
              backgroundColor="rgba(0, 0, 0, 0.5)"
            >
              <Icon as={LockIcon} w={10} h={10} color="white" />
            </Box>
          </Link>
        </Box>
        <CardBody>
          <Link to={`/media_files/${mediaFile._id}`} onClick={handleClick}>
            {song.title}
          </Link>
          <Text mt={1}>{mediaFile.notation?.title || "No notation"}</Text>
          <Text>{song.authorName !== "Unknown" && song.authorName}</Text>
          <HStack justifyContent="space-between" mt={2}>
            <CriticScore score={song.metacritic ?? 0} />
            <Text color="blue.500" fontWeight="bold">
              ${song.price?.toFixed(2)}
            </Text>
          </HStack>
        </CardBody>
      </Card>

      <PurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        songTitle={song.title}
        price={song.price || 0}
        mediaFileId={mediaFile._id}
      />
    </>
  );
};

export default PremiumSongCard;
