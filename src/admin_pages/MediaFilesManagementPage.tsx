import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
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
  Link,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useMediaFiles from "../hooks/useMediaFiles";
import SongMedia from "../entities/SongMedia";

const MediaFilesManagementPage = () => {
  // State to store media files
  const [mediaFiles, setMediaFiles] = useState<SongMedia[]>([]);

  useEffect(() => {
    // Define an async function to fetch media files
    const fetchMediaFiles = async () => {
      try {
        const media_files = await useMediaFiles(); // Await the promise resolution
        setMediaFiles(media_files!); // Update the state with the resolved value
      } catch (error) {
        console.error("Error fetching media files:", error);
      }
    };

    fetchMediaFiles(); // Call the async function
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <ChakraProvider>
      <Box bg="gray.100" minHeight="100vh" p={4}>
        <Box bg="white" shadow="md" p={4} mb={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color={"blue.400"} size="lg">
              Media Files Management
            </Heading>
            <Button
              colorScheme="blue"
              as={RouterLink}
              to="/admin/media_files/add"
            >
              Add media files
            </Button>
          </Flex>
        </Box>

        <Box bg="white" shadow="md" p={4}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Song</Th>
                <Th>Notation</Th>
                <Th>Document</Th>
                <Th>Audio</Th>
                <Th>Image</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mediaFiles!.map((media) => (
                <Tr key={media._id}>
                  <Td color={"blue.400"}>{media.song.title}</Td>
                  <Td color={"blue.400"}>{media.notation.title}</Td>
                  <Td color={"blue.400"}>{media.documentFile}</Td>
                  <Td color={"blue.400"}>{media.audioFile}</Td>
                  <Td color={"blue.400"}>{media.previewImage}</Td>

                  <Td>
                    <Button
                      as={RouterLink}
                      to={`/admin/media_files/edit/${media._id}`}
                      colorScheme="teal"
                      size="sm"
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button colorScheme="red" size="sm">
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default MediaFilesManagementPage;
