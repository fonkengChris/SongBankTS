import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Heading,
  useToast,
  Spinner,
  useColorModeValue,
  Flex,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useVideo } from "../hooks/useVideos";
import APIClient from "../services/api-client";
import Video from "../entities/Video";
import { VIDEOS_ENDPOINT } from "../data/constants";

// Type for video data without _id (used for POST/PUT operations)
type VideoInput = Omit<Video, '_id' | 'createdAt' | 'updatedAt'>;

const VideoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingVideo, isLoading, error } = useVideo(id);

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "regular",
    url: "",
    thumbnailUrl: "",
    duration: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingVideo) {
      setFormData({
        title: existingVideo.title || "",
        description: existingVideo.description || "",
        level: existingVideo.level || "regular",
        url: existingVideo.url || "",
        thumbnailUrl: existingVideo.thumbnailUrl || "",
        duration: existingVideo.duration?.toString() || "",
      });
    }
  }, [existingVideo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.url.trim()) {
      newErrors.url = "Video URL is required";
    }
    if (formData.duration && isNaN(Number(formData.duration))) {
      newErrors.duration = "Duration must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const apiClient = new APIClient<Video, VideoInput>(VIDEOS_ENDPOINT);

      const videoData: VideoInput = {
        title: formData.title,
        description: formData.description,
        level: formData.level as "regular" | "admin",
        url: formData.url,
        thumbnailUrl: formData.thumbnailUrl || undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
      };

      if (id) {
        await apiClient.put(id, videoData);
        toast({
          title: "Video updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiClient.post(videoData);
        toast({
          title: "Video created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      navigate("/admin/videos");
    } catch (error: any) {
      toast({
        title: "Error saving video",
        description: error.response?.data?.error || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Only show loading spinner if we're editing (id exists) and the query is loading
  if (id && isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (id && error) {
    return (
      <Box p={4}>
        <Heading size="md" color="red.500">Error loading video: {error.message}</Heading>
      </Box>
    );
  }

  return (
    <Box maxW="container.md" mx="auto" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500" fontWeight="bold" textAlign="center">
          {id ? "Edit Video" : "Add New Video"}
        </Heading>

        <Card 
          bg={bgColor} 
          shadow="md" 
          border="1px solid" 
          borderColor={borderColor}
          borderRadius="lg"
        >
          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired isInvalid={!!errors.title}>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter video title"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.description}>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Enter video description"
                    rows={4}
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    resize="vertical"
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <HStack spacing={4}>
                  <FormControl isRequired isInvalid={!!errors.level}>
                    <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Level</FormLabel>
                    <Select
                      value={formData.level}
                      onChange={(e) => handleInputChange("level", e.target.value)}
                      bg={inputBg}
                      color={inputColor}
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                      size="lg"
                    >
                      <option value="regular">Regular</option>
                      <option value="admin">Admin</option>
                    </Select>
                    <FormErrorMessage>{errors.level}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.duration}>
                    <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Duration (seconds)</FormLabel>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) =>
                        handleInputChange("duration", e.target.value)
                      }
                      placeholder="Enter duration in seconds"
                      bg={inputBg}
                      color={inputColor}
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.duration}</FormErrorMessage>
                  </FormControl>
                </HStack>

                <FormControl isRequired isInvalid={!!errors.url}>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>YouTube URL</FormLabel>
                  <Input
                    value={formData.url}
                    onChange={(e) => handleInputChange("url", e.target.value)}
                    placeholder="Enter YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.url}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Thumbnail URL (optional)</FormLabel>
                  <Input
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      handleInputChange("thumbnailUrl", e.target.value)
                    }
                    placeholder="Enter thumbnail URL"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                </FormControl>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/videos")}
                    colorScheme="red"
                    flex={1}
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    flex={1}
                    minW="140px"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    {id ? "Update Video" : "Create Video"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default VideoFormPage;
 