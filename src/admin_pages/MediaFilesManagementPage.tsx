import React, { useEffect, useState } from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  useBreakpointValue,
  Text,
  Card,
  CardBody,
  SimpleGrid,
  HStack,
  VStack,
  Badge,
  Spinner,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import useMediaFiles from "../hooks/useMediaFiles";
import SongMedia from "../entities/SongMedia";
import APIClient from "../services/api-client";
import {
  FiEdit,
  FiTrash2,
  FiFile,
  FiMusic,
  FiImage,
  FiDatabase,
} from "react-icons/fi";

const MediaFilesManagementPage = () => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<string | null>(null);
  const [localMediaFiles, setLocalMediaFiles] = useState<SongMedia[]>([]);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const apiClient = new APIClient<SongMedia>("/api/media_files");
  const { mediaFiles, loading, error } = useMediaFiles();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    setLocalMediaFiles(mediaFiles || []);
  }, [mediaFiles]);

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
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  const handleDeleteClick = (mediaId: string) => {
    setMediaToDelete(mediaId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mediaToDelete) return;

    try {
      await apiClient.delete(mediaToDelete);
      setLocalMediaFiles(
        localMediaFiles.filter((media) => media._id !== mediaToDelete)
      );
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

  // Mobile card component
  const MediaCard = ({ media }: { media: SongMedia }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <FiDatabase size={20} color="#3182CE" />
              <Text fontWeight="bold" fontSize="lg" color="blue.500">
                {media.name}
              </Text>
            </HStack>
          </HStack>

          <Stack spacing={3}>
            <HStack justify="space-between">
              <HStack spacing={2}>
                <FiFile size={16} color="#38A169" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  Document:
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" noOfLines={1} color={textColor}>
                {media.documentFile || "N/A"}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <HStack spacing={2}>
                <FiMusic size={16} color="#E53E3E" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  Audio:
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" noOfLines={1} color={textColor}>
                {media.audioFile || "N/A"}
              </Text>
            </HStack>

            <HStack justify="space-between">
              <HStack spacing={2}>
                <FiImage size={16} color="#D69E2E" />
                <Text fontSize="sm" color={secondaryTextColor}>
                  Image:
                </Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" noOfLines={1} color={textColor}>
                {media.previewImage || "N/A"}
              </Text>
            </HStack>
          </Stack>

          <HStack spacing={2}>
            <Button
              colorScheme="teal"
              size="sm"
              leftIcon={<FiEdit />}
              as={RouterLink}
              to={`/admin/media_files/edit/${media._id}`}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDeleteClick(media._id)}
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
            Media Files Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/media_files/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Media File
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {localMediaFiles && localMediaFiles.length > 0 ? (
                localMediaFiles.map((media) => (
                  <MediaCard key={media._id} media={media} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No media files found.</Text>
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
                  <Th color="blue.500">
                    <HStack spacing={2}>
                      <FiDatabase />
                      <Text>Name</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Document</Th>
                  <Th color="blue.500">Audio</Th>
                  <Th color="blue.500">Image</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {localMediaFiles && localMediaFiles.length > 0 ? (
                  localMediaFiles.map((media) => (
                    <Tr key={media._id}>
                      <Td>
                        <Text fontWeight="medium" color="blue.500">
                          {media.name}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={secondaryTextColor} noOfLines={1}>
                          {media.documentFile || "N/A"}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={secondaryTextColor} noOfLines={1}>
                          {media.audioFile || "N/A"}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color={secondaryTextColor} noOfLines={1}>
                          {media.previewImage || "N/A"}
                        </Text>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/media_files/edit/${media._id}`}
                            colorScheme="teal"
                            size="sm"
                            leftIcon={<FiEdit />}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeleteClick(media._id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No media files found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
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
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
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
  );
};

export default MediaFilesManagementPage;
