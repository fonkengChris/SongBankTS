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
import SongCard from "./SongCard";
import PremiumSongCard from "./PremiumSongCard";

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
        const response = await fetch("/api/songs/trending?limit=5");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const trendingData: TrendingSong[] = [];
          data.forEach((song: Song) => {
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

  // Helper function to render appropriate card based on price
  const renderSongCard = ({ song, mediaFile }: TrendingSong) => {
    const isPremium = song.price && song.price > 0;
    
    if (isPremium) {
      return <PremiumSongCard song={song} mediaFile={mediaFile} />;
    } else {
      return <SongCard song={song} mediaFile={mediaFile} />;
    }
  };

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
          {trendingSongs.map((trendingSong) => (
            <Box
              key={`${trendingSong.song._id}-${trendingSong.mediaFile._id}`}
              minW={{ base: "280px", lg: "320px" }}
              maxW={{ base: "280px", lg: "320px" }}
            >
              {renderSongCard(trendingSong)}
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
          {trendingSongs.map((trendingSong) => (
            <Box
              key={`${trendingSong.song._id}-${trendingSong.mediaFile._id}`}
            >
              {renderSongCard(trendingSong)}
            </Box>
          ))}
        </SimpleGrid>
      </Hide>
    </Box>
  );
};

export default TrendingSongs; 