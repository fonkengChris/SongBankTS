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
  Link as ChakraLink,
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
      <Card height="100%" display="flex" flexDirection="column">
        <Box position="relative" overflow="hidden">
          <Link to={`/media_files/${mediaFile._id}`} onClick={handleClick}>
            <Image
              width="100%"
              height={{ base: "200px", sm: "220px", md: "240px", lg: "260px" }}
              objectFit="cover"
              src={mediaFile.previewImage}
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
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
              <Icon
                as={LockIcon}
                w={{ base: 6, md: 8, lg: 10 }}
                h={{ base: 6, md: 8, lg: 10 }}
                color="white"
              />
            </Box>
          </Link>
        </Box>
        <CardBody
          flex={1}
          display="flex"
          flexDirection="column"
          p={{ base: 3, md: 4 }}
        >
          <VStack align="stretch" spacing={2} flex={1}>
            <ChakraLink
              as={Link}
              to={`/media_files/${mediaFile._id}`}
              onClick={handleClick}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="semibold"
              color="blue.600"
              _hover={{ color: "blue.800", textDecoration: "underline" }}
              noOfLines={2}
            >
              {song.title}
            </ChakraLink>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="gray.600"
              noOfLines={1}
            >
              {mediaFile.notation?.title || "No notation"}
            </Text>
            {song.authorName !== "Unknown" && (
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color="gray.500"
                noOfLines={1}
              >
                {song.authorName}
              </Text>
            )}
          </VStack>
          <HStack
            justifyContent="space-between"
            mt={3}
            pt={2}
            borderTop="1px solid"
            borderColor="gray.100"
          >
            <CriticScore score={song.metacritic ?? 0} />
            <Text
              color="blue.500"
              fontWeight="bold"
              fontSize={{ base: "sm", md: "md" }}
            >
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
