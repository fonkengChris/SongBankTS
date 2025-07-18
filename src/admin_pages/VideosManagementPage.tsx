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
import { useAllVideos } from "../hooks/useVideos";
import APIClient from "../services/api-client";
import Video from "../entities/Video";
import { VIDEOS_ENDPOINT } from "../data/constants";
import { FiEdit, FiTrash2, FiEye, FiHeart, FiClock } from "react-icons/fi";

const VideosManagementPage = () => {
  const { data: videos = [], error, isLoading, refetch } = useAllVideos();
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const apiClient = new APIClient<Video>(VIDEOS_ENDPOINT);

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

  // Helper function to safely get nested properties
  const getNestedValue = (obj: any, path: string) => {
    return (
      path.split(".").reduce((acc, part) => acc && acc[part], obj) || "N/A"
    );
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "green";
      case "intermediate":
        return "yellow";
      case "advanced":
        return "orange";
      case "expert":
        return "red";
      default:
        return "gray";
    }
  };

  // Mobile card component
  const VideoCard = ({ video }: { video: Video }) => (
    <Card shadow="sm" border="1px" borderColor="gray.200">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="blue.600">
              {String(video.title || "N/A")}
            </Text>
            <Text fontSize="sm" color="gray.600">
              by {String(video.instructor || "N/A")}
            </Text>
          </VStack>

          <HStack justify="space-between" wrap="wrap" gap={2}>
            <Badge colorScheme={getLevelColor(video.level)} variant="subtle">
              {String(video.level || "N/A")}
            </Badge>
            <Badge colorScheme="blue" variant="subtle">
              {String(getNestedValue(video, "category.title"))}
            </Badge>
            <Badge colorScheme="green" variant="subtle">
              {String(getNestedValue(video, "language.name"))}
            </Badge>
          </HStack>

          <Stack spacing={2}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Views:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {Number(video.views) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Likes:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {Number(video.likesCount) || 0}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Duration:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {formatDuration(video.duration)}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Status:
              </Text>
              <Badge
                colorScheme={video.isPublished ? "green" : "red"}
                variant="subtle"
              >
                {video.isPublished ? "Published" : "Draft"}
              </Badge>
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
      <Box bg="white" shadow="sm" borderRadius="lg" overflow="hidden">
        {isMobile ? (
          // Mobile view - Cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          // Desktop view - Table
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Instructor</Th>
                  <Th>Level</Th>
                  <Th>Category</Th>
                  <Th>Language</Th>
                  <Th>Duration</Th>
                  <Th>Views</Th>
                  <Th>Likes</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {videos.map((video) => (
                  <Tr key={video._id}>
                    <Td>
                      <Text fontWeight="medium" maxW="200px" noOfLines={2}>
                        {video.title}
                      </Text>
                    </Td>
                    <Td>{video.instructor}</Td>
                    <Td>
                      <Badge colorScheme={getLevelColor(video.level)}>
                        {video.level}
                      </Badge>
                    </Td>
                    <Td>{getNestedValue(video, "category.title")}</Td>
                    <Td>{getNestedValue(video, "language.name")}</Td>
                    <Td>
                      <HStack>
                        <FiClock />
                        <Text>{formatDuration(video.duration)}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <FiEye />
                        <Text>{video.views || 0}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
                        <FiHeart />
                        <Text>{video.likesCount || 0}</Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={video.isPublished ? "green" : "red"}
                        variant="subtle"
                      >
                        {video.isPublished ? "Published" : "Draft"}
                      </Badge>
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
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideosManagementPage;
