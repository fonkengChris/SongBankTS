import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Textarea,
  Select,
  useToast,
  useColorModeValue,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import useCategories from "../hooks/useCategories";
import useSong from "../hooks/useSong";
import useMediaFiles from "../hooks/useMediaFiles";
import { SongFormData } from "../types/forms";

const SongFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories } = useCategories();
  const { song } = useSong(id || "");
  const { mediaFiles, loading: mediaLoading } = useMediaFiles();

  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    slug: "",
    description: "",
    lyrics: "",
    language: "",
    authorName: "",
    category: undefined,
    mediaFiles: [],
  });

  const handleMediaSelect = (mediaId: string) => {
    if (!mediaId) return;

    setFormData((prev) => {
      const updatedMediaFiles = [...(prev.mediaFiles || [])];
      const index = updatedMediaFiles.indexOf(mediaId);

      if (index === -1) {
        updatedMediaFiles.push(mediaId);
      } else {
        updatedMediaFiles.splice(index, 1);
      }

      return { ...prev, mediaFiles: updatedMediaFiles };
    });
  };

  useEffect(() => {
    if (id && song) {
      setFormData({
        title: song.title,
        slug: song.slug,
        description: song.description,
        lyrics: song.lyrics,
        language: song.language,
        authorName: song.authorName,
        category: song.category,
        mediaFiles: [],
      });
    }
  }, [id, song]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiClient = new APIClient<Song, SongFormData>("/api/songs");

    try {
      const payload: SongFormData = {
        ...formData,
        category: categories?.find((c) => c._id === formData.category?._id),
        mediaFiles: formData.mediaFiles || [],
      };

      if (id) {
        await apiClient.put(id, payload);
        toast({
          title: "Song updated successfully",
          status: "success",
        });
      } else {
        await apiClient.post(payload);
        toast({
          title: "Song created successfully",
          status: "success",
        });
      }
      navigate("/admin/songs");
    } catch (error) {
      toast({
        title: "Error saving song",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
      });
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData({
      ...formData,
      title: newTitle,
      slug: generateSlug(newTitle),
    });
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading color="blue.500" mb={4}>
            {id ? "Edit Song" : "Add New Song"}
          </Heading>
          <Text color="blue.500" mb={6}>
            Fill in the form below to create a new song. Required fields are
            marked with an asterisk (*). The slug will be automatically
            generated from the title. You can attach up to three media files
            (document, audio, or image) to the song. These media files must be
            created first in the Media Files section.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color="blue.500">Title</FormLabel>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Slug</FormLabel>
              <Input
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
                readOnly
                _readOnly={{ opacity: 0.7 }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Author Name</FormLabel>
              <Input
                value={formData.authorName}
                onChange={(e) =>
                  setFormData({ ...formData, authorName: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Category</FormLabel>
              <Select
                value={formData.category?._id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: categories?.find((c) => c._id === e.target.value),
                  })
                }
                bg={inputBg}
                color={inputColor}
              >
                <option value="">Select category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Language</FormLabel>
              <Input
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="blue.500">Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Lyrics</FormLabel>
              <Textarea
                value={formData.lyrics}
                onChange={(e) =>
                  setFormData({ ...formData, lyrics: e.target.value })
                }
                minHeight="200px"
                bg={inputBg}
                color={inputColor}
              />
            </FormControl>

            <Box borderWidth="1px" borderRadius="lg" p={4} mt={4}>
              <Heading size="md" mb={4} color="blue.500">
                Media Files
              </Heading>

              <FormControl>
                <FormLabel color="blue.500">Select Media Files</FormLabel>
                <Select
                  value=""
                  onChange={(e) => handleMediaSelect(e.target.value)}
                  bg={inputBg}
                  color={inputColor}
                  isDisabled={mediaLoading}
                >
                  <option value="">Select a media file</option>
                  {mediaFiles.map((media) => (
                    <option
                      key={media._id}
                      value={media._id}
                      disabled={formData.mediaFiles?.includes(media._id)}
                    >
                      {media.name}
                      {media.documentFile
                        ? ` - Document: ${media.documentFile}`
                        : ""}
                      {media.audioFile ? ` - Audio: ${media.audioFile}` : ""}
                      {media.previewImage
                        ? ` - Image: ${media.previewImage}`
                        : ""}
                    </option>
                  ))}
                </Select>
                <br />
                <Select
                  value=""
                  onChange={(e) => handleMediaSelect(e.target.value)}
                  bg={inputBg}
                  color={inputColor}
                  isDisabled={mediaLoading}
                >
                  <option value="">Select a media file</option>
                  {mediaFiles.map((media) => (
                    <option
                      key={media._id}
                      value={media._id}
                      disabled={formData.mediaFiles?.includes(media._id)}
                    >
                      {media.name}
                      {media.documentFile
                        ? ` - Document: ${media.documentFile}`
                        : ""}
                      {media.audioFile ? ` - Audio: ${media.audioFile}` : ""}
                      {media.previewImage
                        ? ` - Image: ${media.previewImage}`
                        : ""}
                    </option>
                  ))}
                </Select>
                <br />
                <Select
                  value=""
                  onChange={(e) => handleMediaSelect(e.target.value)}
                  bg={inputBg}
                  color={inputColor}
                  isDisabled={mediaLoading}
                >
                  <option value="">Select a media file</option>
                  {mediaFiles.map((media) => (
                    <option
                      key={media._id}
                      value={media._id}
                      disabled={formData.mediaFiles?.includes(media._id)}
                    >
                      {media.name}
                      {media.documentFile
                        ? ` - Document: ${media.documentFile}`
                        : ""}
                      {media.audioFile ? ` - Audio: ${media.audioFile}` : ""}
                      {media.previewImage
                        ? ` - Image: ${media.previewImage}`
                        : ""}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {formData.mediaFiles && formData.mediaFiles.length > 0 && (
                <Box mt={4}>
                  <FormLabel color="blue.500">Selected Files:</FormLabel>
                  {formData.mediaFiles.map((mediaId) => {
                    const media = mediaFiles.find((m) => m._id === mediaId);
                    if (!media) return null;
                    return (
                      <Flex key={media._id} alignItems="center" gap={2} mb={2}>
                        <Text color={inputColor}>
                          {media.name}
                          {media.documentFile
                            ? ` - Document: ${media.documentFile}`
                            : ""}
                          {media.audioFile
                            ? ` - Audio: ${media.audioFile}`
                            : ""}
                          {media.previewImage
                            ? ` - Image: ${media.previewImage}`
                            : ""}
                        </Text>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleMediaSelect(media._id)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    );
                  })}
                </Box>
              )}
            </Box>

            <Flex gap={4}>
              <Button
                onClick={() => navigate("/admin/songs")}
                colorScheme="red"
                flex={1}
                minW="140px"
              >
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" flex={1} minW="140px">
                {id ? "Update Song" : "Create Song"}
              </Button>
            </Flex>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default SongFormPage;
