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
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAllVideos } from "../hooks/useVideos";
import APIClient from "../services/api-client";
import Video from "../entities/Video";
import { VIDEOS_ENDPOINT } from "../data/constants";
import { FiEdit, FiTrash2, FiClock } from "react-icons/fi";

const VideosManagementPage = () => {
  const { data: videos = [], error, isLoading, refetch } = useAllVideos();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const apiClient = new APIClient<Video>(VIDEOS_ENDPOINT);

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

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
    return <Box p={4}>Error loading videos: {error.message}</Box>;
  }

  const handleDelete = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    setIsDeleting(true);
    try {
      await apiClient.delete(videoId);
      refetch(); // Refetch the videos list after successful deletion
      toast({
        title: "Video deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting video",
        description: "An error occurred while deleting the video",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "regular":
        return "green";
      case "admin":
        return "red";
      default:
        return "gray";
    }
  };

  // Mobile card component
  const VideoCard = ({ video }: { video: Video }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="blue.500">
              {String(video.title || "N/A")}
            </Text>
            <Text fontSize="sm" color={secondaryTextColor} noOfLines={3}>
              {String(video.description || "N/A")}
            </Text>
          </VStack>

          <HStack justify="space-between" wrap="wrap" gap={2}>
            <Badge colorScheme={getLevelColor(video.level)} variant="subtle">
              {String(video.level || "N/A")}
            </Badge>
          </HStack>

          <Stack spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="sm" color={secondaryTextColor}>
                Duration:
              </Text>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {formatDuration(video.duration)}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color={secondaryTextColor}>
                Created:
              </Text>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : "N/A"}
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
              to={`/admin/videos/edit/${video._id}`}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDelete(video._id)}
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
            Videos Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/videos/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Video
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {videos && videos.length > 0 ? (
                videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No videos found.</Text>
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
                  <Th color="blue.500">Description</Th>
                  <Th color="blue.500">Level</Th>
                  <Th color="blue.500">Duration</Th>
                  <Th color="blue.500">Created</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {videos && videos.length > 0 ? (
                  videos.map((video) => (
                    <Tr key={video._id}>
                      <Td>
                        <Text fontWeight="medium" maxW="200px" noOfLines={2} color="blue.500">
                          {video.title}
                        </Text>
                      </Td>
                      <Td>
                        <Text maxW="300px" noOfLines={3} color={secondaryTextColor}>
                          {video.description}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getLevelColor(video.level)}>
                          {video.level}
                        </Badge>
                      </Td>
                      <Td>
                        <HStack>
                          <FiClock />
                          <Text color={textColor}>{formatDuration(video.duration)}</Text>
                        </HStack>
                      </Td>
                      <Td color={textColor}>
                        {video.createdAt ? new Date(video.createdAt).toLocaleDateString() : "N/A"}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            colorScheme="teal"
                            size="sm"
                            leftIcon={<FiEdit />}
                            as={RouterLink}
                            to={`/admin/videos/edit/${video._id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDelete(video._id)}
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
                    <Td colSpan={6} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No videos found.</Text>
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

export default VideosManagementPage;
