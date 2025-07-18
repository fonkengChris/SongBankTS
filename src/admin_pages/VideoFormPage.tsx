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

  console.log("VideoFormPage rendered, id:", id);

  const { data: existingVideo, isLoading, error } = useVideo(id);

  console.log("VideoFormPage - existingVideo:", existingVideo, "isLoading:", isLoading, "error:", error);

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
    console.log("VideoFormPage useEffect - existingVideo:", existingVideo);
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

  console.log("VideoFormPage - about to render, isLoading:", isLoading);

  if (isLoading) {
    console.log("VideoFormPage - showing loading spinner");
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    console.log("VideoFormPage - showing error:", error);
    return (
      <Box p={4}>
        <Heading size="md" color="red.500">Error loading video: {error.message}</Heading>
      </Box>
    );
  }

  console.log("VideoFormPage - rendering form");

  return (
    <Box maxW="container.md" mx="auto" p={6}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg" color="blue.600">
          {id ? "Edit Video" : "Add New Video"}
        </Heading>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.title}>
              <FormLabel>Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter video title"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter video description"
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.level}>
                <FormLabel>Level</FormLabel>
                <Select
                  value={formData.level}
                  onChange={(e) => handleInputChange("level", e.target.value)}
                >
                  <option value="regular">Regular</option>
                  <option value="admin">Admin</option>
                </Select>
                <FormErrorMessage>{errors.level}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.duration}>
                <FormLabel>Duration (seconds)</FormLabel>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="Enter duration in seconds"
                />
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.url}>
              <FormLabel>Video URL</FormLabel>
              <Input
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="Enter video URL"
              />
              <FormErrorMessage>{errors.url}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Thumbnail URL (optional)</FormLabel>
              <Input
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  handleInputChange("thumbnailUrl", e.target.value)
                }
                placeholder="Enter thumbnail URL"
              />
            </FormControl>

            <HStack spacing={4} justify="flex-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/videos")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Saving..."
              >
                {id ? "Update Video" : "Create Video"}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default VideoFormPage;
 