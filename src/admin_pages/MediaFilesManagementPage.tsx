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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useMediaFiles from "../hooks/useMediaFiles";
import SongMedia from "../entities/SongMedia";
import APIClient from "../services/api-client";

const MediaFilesManagementPage = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const apiClient = new APIClient<SongMedia>("/api/media_files");
  const { mediaFiles, loading, error } = useMediaFiles();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching media files",
        description: error,
        status: "error",
        duration: 3000,
      });
    }
  }, [error, toast]);

  if (loading) {
    return <Box p={4}>Loading...</Box>;
  }

  const handleDeleteClick = (mediaId: string) => {
    setMediaToDelete(mediaId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;

    try {
      await apiClient.delete(mediaToDelete);
      setMediaFiles(mediaFiles.filter((media) => media._id !== mediaToDelete));
      toast({
        title: "Media file deleted successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error deleting media file",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setMediaToDelete(null);
    }
  };

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
                <Th>Name</Th>
                <Th>Document</Th>
                <Th>Audio</Th>
                <Th>Image</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mediaFiles?.map((media) => (
                <Tr key={media._id}>
                  <Td color={"blue.400"}>{media.name}</Td>
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
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDeleteClick(media._id)}
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Media File
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? This action cannot be undone.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </ChakraProvider>
  );
};

export default MediaFilesManagementPage;
