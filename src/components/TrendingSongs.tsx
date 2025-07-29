import {
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  Image,
  Link as ChakraLink,
  SimpleGrid,
  Show,
  Hide,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Song from "../entities/Song";
import SongMedia from "../entities/SongMedia";
import CriticScore from "./CriticScore";

interface TrendingSong {
  song: Song;
  mediaFile: SongMedia;
}

const TrendingSongs = () => {
  const [trendingSongs, setTrendingSongs] = useState<TrendingSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const response = await fetch("/api/songs?sortOrder=-trendingScore&limit=5");
        const data = await response.json();
        
        if (data.songs) {
          const trendingData: TrendingSong[] = [];
          data.songs.forEach((song: Song) => {
            if (song.mediaFiles && song.mediaFiles.length > 0) {
              song.mediaFiles.forEach((mediaFile: SongMedia) => {
                trendingData.push({ song, mediaFile });
              });
            }
          });
          setTrendingSongs(trendingData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching trending songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  if (isLoading) {
    return (
      <Box
        paddingY={{ base: 6, md: 8 }}
        paddingX={{ base: 4, md: 6, lg: 8 }}
        bg="gray.800"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.700"
        mb={6}
      >
        <Heading
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontWeight="700"
          color="orange.400"
          mb={4}
          display="flex"
          alignItems="center"
          gap={2}
        >
          🔥 Trending Songs
        </Heading>
        <Text color="gray.400">Loading trending songs...</Text>
      </Box>
    );
  }

  if (trendingSongs.length === 0) {
    return null;
  }

  return (
    <Box
      paddingY={{ base: 6, md: 8 }}
      paddingX={{ base: 4, md: 6, lg: 8 }}
      bg="gray.800"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.700"
      mb={6}
    >
      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        fontWeight="700"
        color="orange.400"
        mb={4}
        display="flex"
        alignItems="center"
        gap={2}
      >
        🔥 Trending Songs
      </Heading>

      {/* Large screens - Horizontal scrollable layout */}
      <Show above="md">
        <HStack
          spacing={4}
          overflowX="auto"
          paddingBottom={2}
          css={{
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2D3748",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#4A5568",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#718096",
            },
          }}
        >
          {trendingSongs.map(({ song, mediaFile }) => (
            <Box
              key={`${song._id}-${mediaFile._id}`}
              minW={{ base: "280px", lg: "320px" }}
              maxW={{ base: "280px", lg: "320px" }}
              bg="gray.700"
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.600"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                borderColor: "orange.400",
              }}
            >
              <ChakraLink as={Link} to={`/media_files/${mediaFile._id}`}>
                <Image
                  src={mediaFile.previewImage}
                  alt={mediaFile.name}
                  width="100%"
                  height="180px"
                  objectFit="cover"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </ChakraLink>
              
              <Box p={4}>
                <VStack align="stretch" spacing={2}>
                  <ChakraLink
                    as={Link}
                    to={`/media_files/${mediaFile._id}`}
                    fontSize="md"
                    fontWeight="600"
                    color="blue.400"
                    _hover={{ color: "blue.300" }}
                    noOfLines={1}
                  >
                    {mediaFile.name}
                  </ChakraLink>
                  
                  <Text fontSize="sm" color="gray.400" noOfLines={1}>
                    {mediaFile.notation?.title || "No notation"}
                  </Text>
                  
                  {song.authorName !== "Unknown" && (
                    <Text fontSize="sm" color="gray.500" noOfLines={1} fontStyle="italic">
                      {song.authorName}
                    </Text>
                  )}
                  
                  <HStack justify="space-between" pt={2}>
                    <CriticScore score={song.metacritic ?? 0} />
                    <Badge
                      colorScheme="orange"
                      variant="solid"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      🔥 {song.trendingScore}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          ))}
        </HStack>
      </Show>

      {/* Small screens - Grid layout */}
      <Hide above="md">
        <SimpleGrid
          columns={{ base: 1, sm: 2 }}
          spacing={4}
          maxH="400px"
          overflowY="auto"
          paddingRight={2}
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#2D3748",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#4A5568",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#718096",
            },
          }}
        >
          {trendingSongs.map(({ song, mediaFile }) => (
            <Box
              key={`${song._id}-${mediaFile._id}`}
              bg="gray.700"
              borderRadius="lg"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.600"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
                borderColor: "orange.400",
              }}
            >
              <ChakraLink as={Link} to={`/media_files/${mediaFile._id}`}>
                <Image
                  src={mediaFile.previewImage}
                  alt={mediaFile.name}
                  width="100%"
                  height="140px"
                  objectFit="cover"
                  transition="transform 0.3s ease"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </ChakraLink>
              
              <Box p={3}>
                <VStack align="stretch" spacing={2}>
                  <ChakraLink
                    as={Link}
                    to={`/media_files/${mediaFile._id}`}
                    fontSize="sm"
                    fontWeight="600"
                    color="blue.400"
                    _hover={{ color: "blue.300" }}
                    noOfLines={1}
                  >
                    {mediaFile.name}
                  </ChakraLink>
                  
                  <Text fontSize="xs" color="gray.400" noOfLines={1}>
                    {mediaFile.notation?.title || "No notation"}
                  </Text>
                  
                  <HStack justify="space-between" pt={1}>
                    <CriticScore score={song.metacritic ?? 0} />
                    <Badge
                      colorScheme="orange"
                      variant="solid"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      🔥 {song.trendingScore}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Hide>
    </Box>
  );
};

export default TrendingSongs; 