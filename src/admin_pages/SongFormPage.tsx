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
  CloseButton,
  Image,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import useCategories from "../hooks/useCategories";
import useSong from "../hooks/useSong";
import useNotations from "../hooks/useNotations";
import SongMedia from "../entities/SongMedia";

const SongFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories } = useCategories();
  const { song } = useSong(id || "");
  const { data: notations } = useNotations();

  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");

  const [formData, setFormData] = useState<Partial<Song>>({
    title: "",
    slug: "",
    description: "",
    lyrics: "",
    language: "",
    authorName: "",
    category: undefined,
    mediaFiles: [],
  });

  const [currentMediaFile, setCurrentMediaFile] = useState<Partial<SongMedia>>({
    documentFile: "",
    audioFile: "",
    previewImage: "",
    notation: undefined,
  });

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
      });
    }
  }, [id, song]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiClient = new APIClient<Song>("/api/songs");

    try {
      if (id) {
        await apiClient.put(id, formData);
        toast({ title: "Song updated successfully", status: "success" });
      } else {
        await apiClient.post(formData as Song);
        toast({ title: "Song created successfully", status: "success" });
      }
      navigate("/admin/songs");
    } catch (error) {
      toast({
        title: "Error saving song",
        description: "Please try again",
        status: "error",
      });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Update the current media file being built
    setCurrentMediaFile((prev) => ({
      ...prev,
      [fileType === "document"
        ? "documentFile"
        : fileType === "audio"
        ? "audioFile"
        : "previewImage"]: `/media/${fileType}s/${file.name}`,
    }));
  };

  const handleAddMediaFile = () => {
    if (
      !currentMediaFile.documentFile &&
      !currentMediaFile.audioFile &&
      !currentMediaFile.previewImage
    )
      return;

    const newMediaFile: SongMedia = {
      _id: Date.now().toString(),
      song: formData as Song,
      documentFile: currentMediaFile.documentFile || "",
      audioFile: currentMediaFile.audioFile || "",
      previewImage: currentMediaFile.previewImage || "",
      notation: currentMediaFile.notation || null,
    };

    setFormData({
      ...formData,
      mediaFiles: [...(formData.mediaFiles || []), newMediaFile],
    });

    // Reset the current media file
    setCurrentMediaFile({
      documentFile: "",
      audioFile: "",
      previewImage: "",
      notation: undefined,
    });
  };

  const handleRemoveMediaFile = (mediaFileId: string) => {
    setFormData({
      ...formData,
      mediaFiles:
        formData.mediaFiles?.filter((media) => media._id !== mediaFileId) || [],
    });
  };

  const renderPreview = (media: SongMedia) => {
    if (media.previewImage) {
      return (
        <Box position="relative" maxW="200px">
          <Image
            src={media.previewImage}
            alt="Preview"
            borderRadius="md"
            maxH="100px"
            objectFit="cover"
          />
        </Box>
      );
    }
    if (media.documentFile) {
      return (
        <Box
          p={2}
          bg="gray.100"
          borderRadius="md"
          display="flex"
          alignItems="center"
        >
          <Text fontSize="sm">📄 {media.documentFile}</Text>
        </Box>
      );
    }
    if (media.audioFile) {
      return (
        <Box
          p={2}
          bg="gray.100"
          borderRadius="md"
          display="flex"
          alignItems="center"
        >
          <Text fontSize="sm">🎵 {media.audioFile}</Text>
        </Box>
      );
    }
    return null;
  };

  useEffect(() => {
    return () => {
      formData.mediaFiles?.forEach((media) => {
        if (media.previewImage && media.previewImage.startsWith("blob:")) {
          URL.revokeObjectURL(media.previewImage);
        }
      });
    };
  }, []);

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">{id ? "Edit Song" : "Add New Song"}</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel color="blue.500">Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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

            <Box p={4} borderWidth="1px" borderRadius="lg" bg={inputBg}>
              <FormLabel color="blue.500">Add Media Files</FormLabel>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel color="blue.500">
                    Document File (PDF/DOC)
                  </FormLabel>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange(e, "document")}
                    bg={inputBg}
                    color={inputColor}
                    p={1}
                  />
                  {currentMediaFile.documentFile && (
                    <Text color={inputColor} fontSize="sm" mt={1}>
                      Selected: {currentMediaFile.documentFile}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500">Audio File</FormLabel>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange(e, "audio")}
                    bg={inputBg}
                    color={inputColor}
                    p={1}
                  />
                  {currentMediaFile.audioFile && (
                    <Text color={inputColor} fontSize="sm" mt={1}>
                      Selected: {currentMediaFile.audioFile}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500">Preview Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    bg={inputBg}
                    color={inputColor}
                    p={1}
                  />
                  {currentMediaFile.previewImage && (
                    <Text color={inputColor} fontSize="sm" mt={1}>
                      Selected: {currentMediaFile.previewImage}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500">Notation</FormLabel>
                  <Select
                    value={currentMediaFile.notation?._id || ""}
                    onChange={(e) =>
                      setCurrentMediaFile((prev) => ({
                        ...prev,
                        notation:
                          notations?.find((n) => n._id === e.target.value) ||
                          undefined,
                      }))
                    }
                    bg={inputBg}
                    color={inputColor}
                  >
                    <option value="">Select notation</option>
                    {notations?.map((notation) => (
                      <option key={notation._id} value={notation._id}>
                        {notation.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  onClick={handleAddMediaFile}
                  colorScheme="blue"
                  isDisabled={
                    !currentMediaFile.documentFile &&
                    !currentMediaFile.audioFile &&
                    !currentMediaFile.previewImage
                  }
                >
                  Add Media Files
                </Button>
              </VStack>
            </Box>

            {formData.mediaFiles && formData.mediaFiles.length > 0 && (
              <Box>
                <FormLabel color="blue.500">Current Media Files:</FormLabel>
                <VStack align="stretch" spacing={3}>
                  {formData.mediaFiles.map((media) => (
                    <Box
                      key={media._id}
                      p={3}
                      bg={inputBg}
                      borderRadius="md"
                      position="relative"
                    >
                      <Flex justify="space-between" align="flex-start">
                        <VStack align="stretch" spacing={2} flex={1}>
                          {media.documentFile && (
                            <Text color={inputColor}>
                              Document: {media.documentFile}
                            </Text>
                          )}
                          {media.audioFile && (
                            <Text color={inputColor}>
                              Audio: {media.audioFile}
                            </Text>
                          )}
                          {media.previewImage && (
                            <Text color={inputColor}>
                              Image: {media.previewImage}
                            </Text>
                          )}
                          {media.notation && (
                            <Text color={inputColor}>
                              Notation: {media.notation.title}
                            </Text>
                          )}
                          {renderPreview(media)}
                        </VStack>
                        <CloseButton
                          onClick={() => handleRemoveMediaFile(media._id)}
                          size="sm"
                          color={inputColor}
                          _hover={{ color: "red.500" }}
                        />
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}

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
