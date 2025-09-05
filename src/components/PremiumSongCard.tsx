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
  useColorModeValue,
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

  // Theme-aware colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  const cardHoverBorderColor = useColorModeValue("gray.300", "gray.600");
  const cardHoverShadow = useColorModeValue("0 12px 40px rgba(0, 0, 0, 0.1)", "0 12px 40px rgba(0, 0, 0, 0.3)");
  const linkColor = useColorModeValue("blue.600", "blue.400");
  const linkHoverColor = useColorModeValue("blue.500", "blue.300");
  const notationColor = useColorModeValue("gray.600", "gray.400");
  const authorColor = useColorModeValue("gray.700", "gray.500");
  const borderTopColor = useColorModeValue("gray.200", "gray.600");

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onOpen();
  };

  return (
    <>
      <Card
        height="100%"
        display="flex"
        flexDirection="column"
        bg={cardBg}
        border="1px solid"
        borderColor={cardBorderColor}
        borderRadius="xl"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: cardHoverShadow,
          borderColor: cardHoverBorderColor,
        }}
      >
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
          p={{ base: 4, md: 5 }}
        >
          <VStack align="stretch" spacing={3} flex={1}>
            <ChakraLink
              as={Link}
              to={`/media_files/${mediaFile._id}`}
              onClick={handleClick}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="700"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateX(2px)",
              }}
              transition="all 0.2s ease"
              noOfLines={2}
              letterSpacing="-0.01em"
            >
              {mediaFile.name}
            </ChakraLink>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color={notationColor}
              noOfLines={1}
              fontWeight="500"
              letterSpacing="0.01em"
            >
              {mediaFile.notation?.title || "No notation"}
            </Text>
            {song.authorName !== "Unknown" && (
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color={authorColor}
                noOfLines={1}
                fontWeight="400"
                fontStyle="italic"
              >
                {song.authorName}
              </Text>
            )}
          </VStack>
          <HStack
            justifyContent="space-between"
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor={borderTopColor}
          >
            <CriticScore score={song.metacritic ?? 0} />
            <Text
              color="green.400"
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.01em"
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
