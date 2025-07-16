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
    <Card shadow="sm" border="1px" borderColor="gray.200">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="blue.600">
              {String(song.title || "N/A")}
            </Text>
            <Text fontSize="sm" color="gray.600">
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

          <Stack spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Views:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {Number(song.views) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Likes:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {Number(song.likesCount) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Popularity:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
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
        bg="white"
        shadow="sm"
        p={{ base: 4, md: 6 }}
        mb={4}
        borderRadius="lg"
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={4}
        >
          <Heading color="blue.600" size="lg">
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
      <Box bg="white" shadow="sm" borderRadius="lg" overflow="hidden">
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {Array.isArray(songs) && songs.length > 0 ? (
                songs.map((song) => <SongCard key={song._id} song={song} />)
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No songs found.</Text>
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
                  <Th color="blue.600">Title</Th>
                  <Th color="blue.600">Author</Th>
                  <Th color="blue.600">Category</Th>
                  <Th color="blue.600">Language</Th>
                  <Th color="blue.600">Price</Th>
                  <Th
                    color="blue.600"
                    display={{ base: "none", xl: "table-cell" }}
                  >
                    Description
                  </Th>
                  <Th
                    color="blue.600"
                    display={{ base: "none", xl: "table-cell" }}
                  >
                    Lyrics
                  </Th>
                  <Th color="blue.600">
                    <HStack spacing={1}>
                      <FiEye />
                      <Text>Views</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.600">
                    <HStack spacing={1}>
                      <FiHeart />
                      <Text>Likes</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.600">Popularity</Th>
                  <Th color="blue.600">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(songs) && songs.length > 0 ? (
                  songs.map((song) => (
                    <Tr key={song._id}>
                      <Td color="blue.600" fontWeight="medium">
                        {String(song.title || "N/A")}
                      </Td>
                      <Td color="blue.600">
                        {String(song.authorName || "N/A")}
                      </Td>
                      <Td>
                        <Badge colorScheme="blue" variant="subtle">
                          {String(getNestedValue(song, "category.title"))}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          {String(song.language.name || "N/A")}
                        </Badge>
                      </Td>
                      <Td>
                        <Badge colorScheme="purple" variant="subtle">
                          {song.price ? `$${song.price.toFixed(2)}` : "Free"}
                        </Badge>
                      </Td>
                      <Td
                        color="blue.600"
                        display={{ base: "none", xl: "table-cell" }}
                      >
                        {typeof song.description === "string"
                          ? song.description.substring(0, 30) + "..."
                          : "N/A"}
                      </Td>
                      <Td
                        color="blue.600"
                        display={{ base: "none", xl: "table-cell" }}
                      >
                        {typeof song.lyrics === "string"
                          ? song.lyrics.substring(0, 30) + "..."
                          : "N/A"}
                      </Td>
                      <Td color="blue.600" isNumeric>
                        {Number(song.views) || 0}
                      </Td>
                      <Td color="blue.600" isNumeric>
                        {Number(song.likesCount) || 0}
                      </Td>
                      <Td color="blue.600" isNumeric>
                        {Number(song.metacritic) || 0}
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
                    <Td colSpan={11} textAlign="center" py={8}>
                      <Text color="gray.500">No songs found.</Text>
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
