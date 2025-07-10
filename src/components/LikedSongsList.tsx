import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useLikedSongs from "../hooks/useLikedSongs";
import { MdMusicNote, MdPerson, MdDescription } from "react-icons/md";

const LikedSongsList = () => {
  const { likedSongs, loading, error } = useLikedSongs(1, 10); // Show first 10 liked songs

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="lg" color="cyan.600" />
        <Text mt={2} color="whiteAlpha.700">
          Loading liked songs...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text>Failed to load liked songs: {error}</Text>
      </Alert>
    );
  }

  if (!likedSongs || likedSongs.songs.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <MdMusicNote size="48px" color="#718096" />
        <Text mt={2} color="whiteAlpha.700" fontSize="lg">
          No liked songs yet
        </Text>
        <Text color="whiteAlpha.500" fontSize="sm">
          Start exploring and liking songs to see them here
        </Text>
      </Box>
    );
  }

  // Flatten media files from all liked songs
  const allMediaFiles = likedSongs.songs.flatMap(
    (song) =>
      song.mediaFiles?.map((mediaFile) => ({
        ...mediaFile,
        songTitle: song.title,
        songAuthor: song.authorName,
        songLanguage: song.language?.name || "Unknown",
        songCategory: song.category?.title || "Uncategorized",
        songViews: song.views,
        songLikes: song.likesCount,
        likedAt: song.likedAt,
      })) || []
  );

  if (allMediaFiles.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <MdDescription size="48px" color="#718096" />
        <Text mt={2} color="whiteAlpha.700" fontSize="lg">
          No media files found
        </Text>
        <Text color="whiteAlpha.500" fontSize="sm">
          The liked songs don't have any media files available
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" color="whiteAlpha.900" mb={4}>
        Liked Media Files ({allMediaFiles.length})
      </Heading>

      <VStack spacing={2} align="stretch">
        {allMediaFiles.map((mediaFile) => (
          <Link
            key={mediaFile._id}
            as={RouterLink}
            to={`/media_files/${mediaFile._id}`}
            _hover={{ textDecoration: "none" }}
          >
            <Box
              p={3}
              bg="rgba(255, 255, 255, 0.05)"
              borderRadius="md"
              border="1px solid"
              borderColor="whiteAlpha.200"
              cursor="pointer"
              _hover={{
                bg: "rgba(255, 255, 255, 0.1)",
                borderColor: "cyan.400",
                transform: "translateY(-1px)",
                transition: "all 0.2s ease-in-out",
              }}
              transition="all 0.2s ease-in-out"
            >
              <HStack justify="space-between" align="center" spacing={3}>
                <HStack flex={1} spacing={3} minW={0}>
                  <Text
                    color="whiteAlpha.900"
                    fontWeight="semibold"
                    fontSize="sm"
                    noOfLines={1}
                    flex={1}
                  >
                    {mediaFile.songTitle} - {mediaFile.name}
                  </Text>
                  <HStack spacing={1} color="whiteAlpha.600" fontSize="xs">
                    <MdPerson size="12px" />
                    <Text noOfLines={1}>{mediaFile.songAuthor}</Text>
                  </HStack>
                </HStack>

                <HStack
                  spacing={2}
                  fontSize="xs"
                  color="whiteAlpha.600"
                  flexShrink={0}
                >
                  <Text>{mediaFile.notation?.title || "No notation"}</Text>
                  <Text>•</Text>
                  <Text>{mediaFile.songLanguage}</Text>
                  <Text>•</Text>
                  <Text>{mediaFile.songViews} views</Text>
                  <Badge colorScheme="cyan" variant="subtle" size="sm">
                    {mediaFile.songLikes}
                  </Badge>
                </HStack>
              </HStack>
            </Box>
          </Link>
        ))}
      </VStack>

      {likedSongs.pagination.hasMore && (
        <Box textAlign="center" mt={4}>
          <Link
            as={RouterLink}
            to="/songs"
            color="cyan.400"
            fontSize="sm"
            _hover={{ textDecoration: "underline" }}
          >
            View all liked songs →
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default LikedSongsList;
