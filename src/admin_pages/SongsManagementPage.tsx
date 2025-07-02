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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAllSongs } from "../hooks/useSongs";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import { SONGS_ENDPOINT } from "../data/constants";

const SongsManagementPage = () => {
  const { data: songs = [], error, isLoading, refetch } = useAllSongs();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const apiClient = new APIClient<Song>(SONGS_ENDPOINT);

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

  return (
    <Box bg="gray.100" minHeight="100vh" p={4}>
      <Box bg="white" shadow="md" p={4} mb={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading color="blue.400" size="lg">
            Songs Management
          </Heading>
          <Button colorScheme="blue" as={RouterLink} to="/admin/songs/add">
            Add Song
          </Button>
        </Flex>
      </Box>

      <Box bg="white" shadow="md" p={4} overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th color="blue.600">Title</Th>
              <Th color="blue.600">Author</Th>
              <Th color="blue.600">Category</Th>
              <Th color="blue.600">Language</Th>
              <Th color="blue.600">Price</Th>
              <Th color="blue.600">Description</Th>
              <Th color="blue.600">Lyrics</Th>
              <Th color="blue.600">Views</Th>
              <Th color="blue.600">Likes</Th>
              <Th color="blue.600">Popularity</Th>
              <Th color="blue.600">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(songs) && songs.length > 0 ? (
              songs.map((song) => (
                <Tr key={song._id}>
                  <Td color="blue.500">{String(song.title || "N/A")}</Td>
                  <Td color="blue.500">{String(song.authorName || "N/A")}</Td>
                  <Td color="blue.500">
                    {String(getNestedValue(song, "category.title"))}
                  </Td>
                  <Td color="blue.500">
                    {String(song.language.name || "N/A")}
                  </Td>
                  <Td color="blue.500">
                    {song.price ? `$${song.price.toFixed(2)}` : "Free"}
                  </Td>
                  <Td color="blue.500">
                    {typeof song.description === "string"
                      ? song.description.substring(0, 30) + "..."
                      : "N/A"}
                  </Td>
                  <Td color="blue.500">
                    {typeof song.lyrics === "string"
                      ? song.lyrics.substring(0, 30) + "..."
                      : "N/A"}
                  </Td>
                  <Td color="blue.500" isNumeric>
                    {Number(song.views) || 0}
                  </Td>
                  <Td color="blue.500" isNumeric>
                    {Number(song.likesCount) || 0}
                  </Td>
                  <Td color="blue.500" isNumeric>
                    {Number(song.metacritic) || 0}
                  </Td>
                  <Td>
                    <Button
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                      as={RouterLink}
                      to={`/admin/songs/edit/${song._id}`}
                    >
                      Edit
                    </Button>
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(song._id)}
                      isDisabled={isDeleting}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={10} textAlign="center" color="blue.500">
                  No songs found.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SongsManagementPage;
