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
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useLikedSongs from "../hooks/useLikedSongs";
import { MdMusicNote, MdPerson, MdDescription } from "react-icons/md";

const LikedSongsList = () => {
  const { likedSongs, loading, error } = useLikedSongs(1, 10); // Show first 10 liked songs
  
  // Responsive values for mobile/desktop
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Theme-aware colors
  const spinnerColor = useColorModeValue("blue.600", "cyan.600");
  const loadingTextColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const headingColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const emptyStateIconColor = useColorModeValue("gray.500", "#718096");
  const emptyStateTextColor = useColorModeValue("gray.600", "whiteAlpha.700");
  const emptyStateSubtextColor = useColorModeValue("gray.500", "whiteAlpha.500");
  const linkColor = useColorModeValue("blue.600", "blue.400");
  const linkHoverColor = useColorModeValue("blue.500", "blue.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  const cardHoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="lg" color={spinnerColor} />
        <Text mt={2} color={loadingTextColor}>
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
        <MdMusicNote size="48px" color={emptyStateIconColor} />
        <Text mt={2} color={emptyStateTextColor} fontSize="lg">
          No liked songs yet
        </Text>
        <Text color={emptyStateSubtextColor} fontSize="sm">
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
        <MdDescription size="48px" color={emptyStateIconColor} />
        <Text mt={2} color={emptyStateTextColor} fontSize="lg">
          No media files found
        </Text>
        <Text color={emptyStateSubtextColor} fontSize="sm">
          The liked songs don't have any media files available
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" color={headingColor} mb={4}>
        Liked song files ({allMediaFiles.length})
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
              bg={cardBg}
              borderRadius="md"
              border="1px solid"
              borderColor={cardBorderColor}
              cursor="pointer"
              _hover={{
                bg: cardHoverBg,
                borderColor: linkColor,
                transform: "translateY(-1px)",
                transition: "all 0.2s ease-in-out",
              }}
              transition="all 0.2s ease-in-out"
            >
              {isMobile ? (
                // Mobile layout - simplified with truncated names
                <VStack spacing={2} align="stretch">
                  <Text
                    color={textColor}
                    fontWeight="semibold"
                    fontSize="sm"
                    noOfLines={1}
                    title={`${mediaFile.songTitle} - ${mediaFile.name}`}
                  >
                    {mediaFile.songTitle} - {mediaFile.name}
                  </Text>
                  <HStack spacing={2} color={subtextColor} fontSize="xs" flexWrap="wrap">
                    <HStack spacing={1}>
                      <MdPerson size="12px" />
                      <Text noOfLines={1}>{mediaFile.songAuthor}</Text>
                    </HStack>
                    <Text>•</Text>
                    <Text noOfLines={1}>{mediaFile.notation?.title || "No notation"}</Text>
                    <Text>•</Text>
                    <Text noOfLines={1}>{mediaFile.songLanguage}</Text>
                  </HStack>
                  <HStack spacing={2} fontSize="xs" color={subtextColor}>
                    <Text>{mediaFile.songViews} views</Text>
                    <Badge colorScheme="cyan" variant="subtle" size="sm">
                      {mediaFile.songLikes}
                    </Badge>
                  </HStack>
                </VStack>
              ) : (
                // Desktop layout - original design
                <HStack justify="space-between" align="center" spacing={3}>
                  <HStack flex={1} spacing={3} minW={0}>
                    <Text
                      color={textColor}
                      fontWeight="semibold"
                      fontSize="sm"
                      noOfLines={1}
                      flex={1}
                    >
                      {mediaFile.songTitle} - {mediaFile.name}
                    </Text>
                    <HStack spacing={1} color={subtextColor} fontSize="xs">
                      <MdPerson size="12px" />
                      <Text noOfLines={1}>{mediaFile.songAuthor}</Text>
                    </HStack>
                  </HStack>

                  <HStack
                    spacing={2}
                    fontSize="xs"
                    color={subtextColor}
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
              )}
            </Box>
          </Link>
        ))}
      </VStack>

      {likedSongs.pagination.hasMore && (
        <Box textAlign="center" mt={4}>
          <Link
            as={RouterLink}
            to="/songs"
            color={linkColor}
            fontSize="sm"
            _hover={{ textDecoration: "underline", color: linkHoverColor }}
          >
            View all liked songs →
          </Link>
        </Box>
      )}
    </Box>
  );
};

export default LikedSongsList;
