import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Spinner,
  VStack,
  Button,
  Icon,
  HStack,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaStar, FaMusic } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useFavourites } from "../hooks/useFavourites";
import { useState } from "react";

const FavouriteSongsList = () => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isFetching } = useFavourites(page, 12);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  if (isLoading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="lg" color="cyan.500" />
        <Text color="gray.600">Loading your favourite songs...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} py={8}>
        <Icon as={FaStar} boxSize={12} color="yellow.300" />
        <Text color="red.500">Failed to load favourite songs</Text>
        <Text fontSize="sm" color="gray.600">
          {error instanceof Error ? error.message : 'An error occurred'}
        </Text>
      </VStack>
    );
  }

  if (!data || data.songs.length === 0) {
    return (
      <VStack spacing={6} py={12}>
        <Icon as={FaStar} boxSize={16} color="gray.400" />
        <VStack spacing={2}>
          <Heading size="md" color="gray.600">
            No Favourite Songs Yet
          </Heading>
          <Text color="gray.500" textAlign="center" maxW="md">
            Start exploring songs and add them to your favourites by clicking the star icon!
          </Text>
        </VStack>
        <Button
          as={RouterLink}
          to="/songs"
          colorScheme="cyan"
          leftIcon={<Icon as={FaMusic} />}
          size="lg"
        >
          Explore Songs
        </Button>
      </VStack>
    );
  }

  const handleLoadMore = () => {
    if (data.pagination.hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between" align="center">
        <Heading size="lg" color="whiteAlpha.900">
          My Favourite Songs
        </Heading>
        <Badge colorScheme="cyan" fontSize="sm" px={3} py={1} borderRadius="full">
          {data.pagination.totalItems} favourites
        </Badge>
      </HStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {data.songs.map((song) => {
          const mediaFile = song.mediaFiles?.[0]; // Use first media file for preview
          
          // Skip songs without media files or with invalid media file IDs
          if (!mediaFile || !mediaFile._id) {
            console.warn(`Song ${song._id} has no valid media files`);
            return null;
          }

          return (
            <Box
              key={song._id}
              as={RouterLink}
              to={`/media_files/${mediaFile._id}`}
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
              borderRadius="lg"
              p={4}
              transition="all 0.2s"
              _hover={{
                bg: hoverBg,
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
            >
              <VStack spacing={3} align="stretch">
                <Box position="relative">
                  <Box
                    bg="gray.200"
                    height="120px"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    overflow="hidden"
                  >
                    {mediaFile.previewImage ? (
                      <Box
                        as="img"
                        src={mediaFile.previewImage}
                        alt={song.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    ) : (
                      <Icon as={FaMusic} boxSize={8} color="gray.400" />
                    )}
                  </Box>
                  <Box
                    position="absolute"
                    top={2}
                    right={2}
                    bg="yellow.500"
                    borderRadius="full"
                    p={1}
                  >
                    <Icon as={FaStar} boxSize={3} color="white" />
                  </Box>
                </Box>

                <VStack spacing={1} align="stretch">
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    noOfLines={2}
                    color="gray.800"
                  >
                    {song.title}
                  </Text>
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    by {song.authorName}
                  </Text>
                  <HStack spacing={2} fontSize="xs" color="gray.500">
                    <Text>{song.language?.name}</Text>
                    <Text>•</Text>
                    <Text>{song.category?.title}</Text>
                  </HStack>
                </VStack>

                <HStack justify="space-between" fontSize="xs" color="gray.500">
                  <HStack spacing={2}>
                    <Text>{song.favouritesCount} favourites</Text>
                    <Text>•</Text>
                    <Text>{song.views} views</Text>
                  </HStack>
                  <Text>
                    {new Date((song as any).favouritedAt || song.lastUpdate).toLocaleDateString()}
                  </Text>
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>

      {data.pagination.hasMore && (
        <Box textAlign="center" py={4}>
          <Button
            onClick={handleLoadMore}
            isLoading={isFetching}
            loadingText="Loading more..."
            colorScheme="cyan"
            variant="outline"
            size="lg"
          >
            Load More Favourites
          </Button>
        </Box>
      )}

      {!data.pagination.hasMore && data.songs.length > 0 && (
        <Text textAlign="center" color="gray.500" fontSize="sm" py={2}>
          You've reached the end of your favourites list
        </Text>
      )}
    </VStack>
  );
};

export default FavouriteSongsList;
