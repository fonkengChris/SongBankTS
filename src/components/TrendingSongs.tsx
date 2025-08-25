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
import usePurchases from "../hooks/usePurchases";
import { hasUserPurchased } from "../utils/purchase-utils";

interface TrendingSong {
  song: Song;
  mediaFile: SongMedia;
}

const TrendingSongs = () => {
  const [trendingSongs, setTrendingSongs] = useState<TrendingSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: purchases, isLoading: isLoadingPurchases } = usePurchases();

  useEffect(() => {
    const fetchTrendingSongs = async () => {
      try {
        const response = await fetch("/api/songs/trending?limit=10");
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
          setTrendingSongs(trendingData);
        }
      } catch (error) {
        console.error("Error fetching trending songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingSongs();
  }, []);

  // Helper function to render appropriate card based on price and purchase status
  const renderSongCard = ({ song, mediaFile }: TrendingSong) => {
    // If the song has a price, check if user has purchased it
    if (song.price && song.price > 0) {
      // If purchases are still loading, show premium card to be safe
      if (isLoadingPurchases) {
        return <PremiumSongCard song={song} mediaFile={mediaFile} />;
      }
      // Check if user has purchased this specific media file
      const hasPurchased = hasUserPurchased(mediaFile._id, purchases || []);
      if (hasPurchased) {
        return <SongCard song={song} mediaFile={mediaFile} />;
      } else {
        return <PremiumSongCard song={song} mediaFile={mediaFile} />;
      }
    } else {
      // Free songs always show as regular cards
      return <SongCard song={song} mediaFile={mediaFile} />;
    }
  };

  if (isLoading) {
    return (
      <Box
        paddingY={{ base: 4, md: 6, lg: 8 }}
        paddingX={{ base: 3, md: 4, lg: 5 }}
        bg="gray.800"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.700"
        mb={5}
        maxW="100%"
        overflow="hidden"
        boxSizing="border-box"
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
      paddingY={{ base: 4, md: 6, lg: 8 }}
      paddingX={{ base: 3, md: 4, lg: 5 }}
      bg="gray.800"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.700"
      mb={5}
      maxW="100%"
      overflow="hidden"
      boxSizing="border-box"
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

      {/* Large screens - Grid layout */}
      <Show above="md">
        <SimpleGrid
          columns={4}
          spacing={4}
          maxW="100%"
        >
          {trendingSongs.slice(0, 4).map((trendingSong) => (
            <Box
              key={`${trendingSong.song._id}-${trendingSong.mediaFile._id}`}
              maxW="100%"
            >
              {renderSongCard(trendingSong)}
            </Box>
          ))}
        </SimpleGrid>
      </Show>

      {/* Small screens - Grid layout */}
      <Hide above="md">
        <Box
          display="grid"
          gridTemplateColumns={{
            base: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)"
          }}
          gap={4}
          maxH="400px"
          overflowY="auto"
          paddingRight={2}
          maxW="100%"
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
        </Box>
      </Hide>
    </Box>
  );
};

export default TrendingSongs; 