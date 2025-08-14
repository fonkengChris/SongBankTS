import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Text,
  VStack,
  Box,
  Link as ChakraLink,
  Badge,
  Wrap,
  WrapItem,
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
  // Check if this song was originally premium but is now accessible
  const isPurchasedPremium = song.price && song.price > 0;

  return (
    <Card
      height="100%"
      display="flex"
      flexDirection="column"
      bg="gray.800"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
        borderColor: "gray.600",
      }}
    >
      <Box position="relative" overflow="hidden">
        <Link to={"/media_files/" + mediaFile._id}>
          <Image
            width="100%"
            height={{ base: "200px", sm: "220px", md: "240px", lg: "260px" }}
            objectFit="cover"
            src={mediaFile.previewImage}
            transition="transform 0.3s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
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
            to={"/media_files/" + mediaFile._id}
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            color="blue.400"
            _hover={{
              color: "blue.300",
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
            color="gray.400"
            noOfLines={1}
            fontWeight="500"
            letterSpacing="0.01em"
          >
            {mediaFile.notation?.title || "No notation"}
          </Text>
          {song.authorName !== "Unknown" && (
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="gray.500"
              noOfLines={1}
              fontWeight="400"
              fontStyle="italic"
            >
              {song.authorName}
            </Text>
          )}
          {song.tags && song.tags.length > 0 && (
            <Wrap spacing={1} maxH="60px" overflow="hidden">
              {song.tags.slice(0, 3).map((tag, index) => (
                <WrapItem key={index}>
                  <Badge
                    colorScheme="gray"
                    variant="subtle"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {tag}
                  </Badge>
                </WrapItem>
              ))}
              {song.tags.length > 3 && (
                <WrapItem>
                  <Badge
                    colorScheme="gray"
                    variant="outline"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    +{song.tags.length - 3}
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
          )}
        </VStack>
        <HStack
          justifyContent="space-between"
          mt={4}
          pt={4}
          borderTop="1px solid"
          borderColor="gray.600"
        >
          <CriticScore score={song.metacritic ?? 0} />
          <HStack spacing={2}>
            {song.trendingScore && song.trendingScore > 50 && (
              <Badge
                colorScheme="orange"
                variant="solid"
                fontSize="xs"
                px={2}
                py={1}
                borderRadius="full"
              >
                🔥 Trending
              </Badge>
            )}
            <Text
              color={isPurchasedPremium ? "purple.400" : "green.400"}
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
              letterSpacing="0.01em"
            >
              {isPurchasedPremium ? "Purchased" : "Free"}
            </Text>
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default SongCard;
