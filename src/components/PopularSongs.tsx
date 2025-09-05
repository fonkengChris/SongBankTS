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
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Song from "../entities/Song";
import SongMedia from "../entities/SongMedia";
import CriticScore from "./CriticScore";
import usePopularSongs from "../hooks/usePopularSongs";
import usePurchases from "../hooks/usePurchases";
import SongCard from "./SongCard";
import PremiumSongCard from "./PremiumSongCard";
import { hasUserPurchased } from "../utils/purchase-utils";

interface PopularSong {
  song: Song;
  mediaFile: SongMedia;
}

const PopularSongs = () => {
  const { data: songs, isLoading, error } = usePopularSongs(10);
  const { data: purchases, isLoading: isLoadingPurchases } = usePurchases();
  const [popularSongs, setPopularSongs] = useState<PopularSong[]>([]);

  // Theme-aware colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  const loadingTextColor = useColorModeValue("gray.600", "gray.400");
  const headingColor = useColorModeValue("gray.800", "white");

  useEffect(() => {
    if (songs && Array.isArray(songs)) {
      const popularData: PopularSong[] = [];
      songs.forEach((song: Song) => {
        if (song.mediaFiles && song.mediaFiles.length > 0) {
          song.mediaFiles.forEach((mediaFile: SongMedia) => {
            popularData.push({ song, mediaFile });
          });
        }
      });
      setPopularSongs(popularData);
    }
  }, [songs]);

  // Helper function to render appropriate card based on price and purchase status
  const renderSongCard = ({ song, mediaFile }: PopularSong) => {
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
        bg={cardBg}
        borderRadius="xl"
        border="1px solid"
        borderColor={cardBorderColor}
        mb={5}
        maxW="100%"
        overflow="hidden"
        boxSizing="border-box"
      >
        <Heading
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontWeight="700"
          color={headingColor}
          mb={4}
          display="flex"
          alignItems="center"
          gap={2}
        >
          ⭐ Popular Songs
        </Heading>
        <Text color={loadingTextColor}>Loading popular songs...</Text>
      </Box>
    );
  }

  if (error) {
    return null;
  }

  if (popularSongs.length === 0) {
    return null;
  }

  return (
    <Box
      paddingY={{ base: 4, md: 6, lg: 8 }}
      paddingX={{ base: 3, md: 4, lg: 5 }}
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorderColor}
      mb={5}
      maxW="100%"
      overflow="hidden"
      boxSizing="border-box"
    >
      <Heading
        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
        fontWeight="700"
        color={headingColor}
        mb={4}
        display="flex"
        alignItems="center"
        gap={2}
      >
        ⭐ Popular Songs
      </Heading>

      {/* Large screens - Grid layout */}
      <Show above="md">
        <SimpleGrid
          columns={4}
          spacing={4}
          maxW="100%"
        >
          {popularSongs.slice(0, 4).map((popularSong) => (
            <Box
              key={`${popularSong.song._id}-${popularSong.mediaFile._id}`}
              maxW="100%"
            >
              {renderSongCard(popularSong)}
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
          {popularSongs.map((popularSong) => (
            <Box
              key={`${popularSong.song._id}-${popularSong.mediaFile._id}`}
            >
              {renderSongCard(popularSong)}
            </Box>
          ))}
        </Box>
      </Hide>
    </Box>
  );
};

export default PopularSongs; 