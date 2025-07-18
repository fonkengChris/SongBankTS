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
  Switch,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import useCategories from "../hooks/useCategories";
import useLanguages from "../hooks/useLanguages";
import { useVideo } from "../hooks/useVideos";
import APIClient from "../services/api-client";
import Video from "../entities/Video";
import { VIDEOS_ENDPOINT } from "../data/constants";

const VideoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { data: categories = [] } = useCategories();
  const { data: languages = [] } = useLanguages();
  const { data: existingVideo, isLoading } = useVideo(id);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "beginner",
    url: "",
    thumbnailUrl: "",
    duration: "",
    category: "",
    language: "",
    instructor: "",
    tags: [] as string[],
    isPublished: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingVideo) {
      setFormData({
        title: existingVideo.title || "",
        description: existingVideo.description || "",
        level: existingVideo.level || "beginner",
        url: existingVideo.url || "",
        thumbnailUrl: existingVideo.thumbnailUrl || "",
        duration: existingVideo.duration?.toString() || "",
        category: existingVideo.category?._id || "",
        language: existingVideo.language?._id || "",
        instructor: existingVideo.instructor || "",
        tags: existingVideo.tags || [],
        isPublished: existingVideo.isPublished ?? true,
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
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.language) {
      newErrors.language = "Language is required";
    }
    if (!formData.instructor.trim()) {
      newErrors.instructor = "Instructor is required";
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
      const apiClient = new APIClient<Video>(VIDEOS_ENDPOINT);
      const selectedCategory = categories.find(
        (cat: any) => cat._id === formData.category
      );
      const selectedLanguage = languages.find(
        (lang: any) => lang._id === formData.language
      );

      const videoData = {
        ...formData,
        level: formData.level as
          | "beginner"
          | "intermediate"
          | "advanced"
          | "expert",
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        category: selectedCategory,
        language: selectedLanguage,
      };

      if (id) {
        await apiClient.put(id, videoData as any);
        toast({
          title: "Video updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await apiClient.post(videoData as any);
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    );
  }

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
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
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
                  placeholder="e.g., 300"
                />
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.url}>
              <FormLabel>Video URL</FormLabel>
              <Input
                value={formData.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
              <FormErrorMessage>{errors.url}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Thumbnail URL</FormLabel>
              <Input
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  handleInputChange("thumbnailUrl", e.target.value)
                }
                placeholder="Enter thumbnail image URL (optional)"
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl isInvalid={!!errors.category}>
                <FormLabel>Category</FormLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  placeholder="Select category"
                >
                  {categories.map((category: any) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.category}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.language}>
                <FormLabel>Language</FormLabel>
                <Select
                  value={formData.language}
                  onChange={(e) =>
                    handleInputChange("language", e.target.value)
                  }
                  placeholder="Select language"
                >
                  {languages.map((language: any) => (
                    <option key={language._id} value={language._id}>
                      {language.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.language}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.instructor}>
              <FormLabel>Instructor</FormLabel>
              <Input
                value={formData.instructor}
                onChange={(e) =>
                  handleInputChange("instructor", e.target.value)
                }
                placeholder="Enter instructor name"
              />
              <FormErrorMessage>{errors.instructor}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <InputGroup>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags (press Enter to add)"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={addTag}>
                    Add
                  </Button>
                </InputRightElement>
              </InputGroup>
              <HStack spacing={2} mt={2} wrap="wrap">
                {formData.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    size="md"
                    colorScheme="blue"
                    borderRadius="full"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="isPublished" mb="0">
                Published
              </FormLabel>
              <Switch
                id="isPublished"
                isChecked={formData.isPublished}
                onChange={(e) =>
                  handleInputChange("isPublished", e.target.checked)
                }
              />
            </FormControl>

            <HStack spacing={4} justify="flex-end">
              <Button
                onClick={() => navigate("/admin/videos")}
                variant="outline"
                isDisabled={isSubmitting}
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
