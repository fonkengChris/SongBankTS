import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Flex,
  Spinner,
  useToast,
  useBreakpointValue,
  Text,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  Stack,
  Divider,
  useColorModeValue,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAllSongs } from "../hooks/useSongs";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import { SONGS_ENDPOINT } from "../data/constants";
import { FiEdit, FiTrash2, FiEye, FiHeart } from "react-icons/fi";

const SongsManagementPage = () => {
  const { data: songs = [], error, isLoading, refetch } = useAllSongs();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (isLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return <Box p={4}>Error loading songs: {error.message}</Box>;
  }

  const handleDelete = async (songId: string) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(songId);
      refetch(); // Refetch the songs list after successful deletion
      toast({
        title: "Song deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting song",
        description: "An error occurred while deleting the song",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to safely get nested properties
  const getNestedValue = (obj: any, path: string) => {
    return (
      path.split(".").reduce((acc, part) => acc && acc[part], obj) || "N/A"
    );
  };

  // Mobile card component
  const SongCard = ({ song }: { song: Song }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="blue.500">
              {String(song.title || "N/A")}
            </Text>
            <Text fontSize="sm" color={secondaryTextColor}>
              by {String(song.authorName || "N/A")}
            </Text>
          </VStack>

          <HStack justify="space-between" wrap="wrap" gap={2}>
            <Badge colorScheme="blue" variant="subtle">
              {String(getNestedValue(song, "category.title"))}
            </Badge>
            <Badge colorScheme="green" variant="subtle">
              {String(song.language.name || "N/A")}
            </Badge>
            <Badge colorScheme="purple" variant="subtle">
              {song.price ? `$${song.price.toFixed(2)}` : "Free"}
            </Badge>
          </HStack>

          {song.tags && song.tags.length > 0 && (
            <Wrap spacing={1}>
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

          <Stack spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="sm" color={secondaryTextColor}>
                Views:
              </Text>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {Number(song.views) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color={secondaryTextColor}>
                Likes:
              </Text>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {Number(song.likesCount) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color={secondaryTextColor}>
                Popularity:
              </Text>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {Number(song.metacritic) || 0}
              </Text>
            </HStack>
          </Stack>

          <Divider />

          <HStack spacing={2}>
            <Button
              colorScheme="teal"
              size="sm"
              leftIcon={<FiEdit />}
              as={RouterLink}
              to={`/admin/songs/edit/${song._id}`}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDelete(song._id)}
              isDisabled={isDeleting}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        bg={cardBg}
        shadow="sm"
        p={{ base: 4, md: 6 }}
        mb={4}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={4}
        >
          <Heading color="blue.500" size="lg">
            Songs Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/songs/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Song
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {songs && songs.length > 0 ? (
                songs.map((song) => (
                  <SongCard key={song._id} song={song} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No songs found.</Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>
        ) : (
          // Desktop/Tablet layout with table
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="blue.500">Title</Th>
                  <Th color="blue.500">Author</Th>
                  <Th color="blue.500">Category</Th>
                  <Th color="blue.500">Language</Th>
                  <Th color="blue.500">Price</Th>
                  <Th color="blue.500">Tags</Th>
                  <Th color="blue.500">Views</Th>
                  <Th color="blue.500">Likes</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {songs && songs.length > 0 ? (
                  songs.map((song) => (
                    <Tr key={song._id}>
                      <Td>
                        <Text fontWeight="medium" maxW="200px" noOfLines={2} color="blue.500">
                          {song.title}
                        </Text>
                      </Td>
                      <Td color={secondaryTextColor}>
                        {song.authorName}
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" variant="subtle">
                          {getNestedValue(song, "category.title")}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          {song.language.name}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="purple" variant="subtle">
                          {song.price ? `$${song.price.toFixed(2)}` : "Free"}
                        </Badge>
                      </Td>
                      <Td>
                        {song.tags && song.tags.length > 0 ? (
                          <Wrap spacing={1}>
                            {song.tags.slice(0, 2).map((tag, index) => (
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
                            {song.tags.length > 2 && (
                              <WrapItem>
                                <Badge
                                  colorScheme="gray"
                                  variant="outline"
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                  borderRadius="full"
                                >
                                  +{song.tags.length - 2}
                                </Badge>
                              </WrapItem>
                            )}
                          </Wrap>
                        ) : (
                          <Text color={textColor} fontSize="sm">No tags</Text>
                        )}
                      </Td>
                      <Td color={textColor}>
                        {Number(song.views) || 0}
                      </Td>
                      <Td color={textColor}>
                        {Number(song.likesCount) || 0}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            colorScheme="teal"
                            size="sm"
                            leftIcon={<FiEdit />}
                            as={RouterLink}
                            to={`/admin/songs/edit/${song._id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDelete(song._id)}
                            isDisabled={isDeleting}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={9} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No songs found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SongsManagementPage;
