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
  Card,
  CardBody,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import APIClient from "../services/api-client";
import Song from "../entities/Song";
import useCategories from "../hooks/useCategories";
import useSong from "../hooks/useSong";
import useMediaFiles from "../hooks/useMediaFiles";
import { SongFormData } from "../types/forms";
import useLanguages from "../hooks/useLanguages";

const SongFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { song, loading: songLoading } = useSong(id || "");
  const { mediaFiles, loading: mediaLoading } = useMediaFiles();
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");
  const mediaFilesBg = useColorModeValue("gray.50", "gray.700");

  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    slug: "",
    description: "",
    lyrics: "",
    language: { _id: "", name: "", code: "" },
    authorName: "",
    category: undefined,
    mediaFiles: [],
    price: undefined,
    youtubeUrl: "",
    tags: [],
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

  const handleAddTag = (tag?: string) => {
    const tagToAdd = tag || tagInput;
    if (!tagToAdd.trim() || formData.tags?.includes(tagToAdd.trim())) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagToAdd.trim()]
    }));
    setTagInput("");
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  useEffect(() => {
    if (id && song && categories && languages) {
      // Find the actual category and language objects
      // Handle both cases: when they come as populated objects or as string IDs
      const categoryId = typeof song.category === 'string' ? song.category : song.category?._id;
      const languageId = typeof song.language === 'string' ? song.language : song.language?._id;
      
      const categoryObj = categoryId ? 
        (typeof song.category === 'object' ? song.category : categories.find(cat => cat._id === categoryId)) 
        : undefined;
        
      // Find language object, but fall back gracefully if not found
      let languageObj = { _id: "", name: "", code: "" };
      if (languageId) {
        if (typeof song.language === 'object') {
          // Check if this language exists in available languages
          const existsInAvailable = languages.some(lang => lang._id === song.language._id);
          if (existsInAvailable) {
            languageObj = song.language;
          } else {
            console.warn(`Language ${song.language._id} (${song.language.name}) from song not found in available languages`);
          }
        } else {
          const foundLang = languages.find(lang => lang._id === languageId);
          if (foundLang) {
            languageObj = foundLang;
          } else {
            console.warn(`Language ID ${languageId} from song not found in available languages`);
          }
        }
      }
      
      setFormData({
        title: song.title || "",
        slug: song.slug || "",
        description: song.description || "",
        lyrics: song.lyrics || "",
        language: languageObj,
        authorName: song.authorName || "",
        category: categoryObj,
        mediaFiles: song.mediaFiles?.map(file => typeof file === 'string' ? file : file._id) || [],
        price: song.price || undefined,
        youtubeUrl: song.youtubeUrl || "",
        tags: song.tags || [],
      });
    }
  }, [id, song, categories, languages]);

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

  // Check if we should show loading state
  const isLoading = id && (songLoading || categoriesLoading || languagesLoading);

  return (
    <Box maxW="container.md" mx="auto" py={8} px={6}>
      {isLoading ? (
        <VStack spacing={4} textAlign="center">
          <Text>Loading song data...</Text>
          <Box>Loading...</Box>
        </VStack>
      ) : (
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading color="blue.500" fontWeight="bold" textAlign="center" mb={4}>
              {id ? "Edit Song" : "Add New Song"}
            </Heading>
            <Text color="blue.500" mb={6} textAlign="center">
              Fill in the form below to create a new song. Required fields are
              marked with an asterisk (*). The slug will be automatically
              generated from the title. You can attach up to three media files
              (document, audio, or image) to the song. These media files must be
              created first in the Media Files section.
            </Text>
          </Box>

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
                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={handleTitleChange}
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
                    placeholder="Enter song title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Slug</FormLabel>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
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
                    readOnly
                    _readOnly={{ opacity: 0.7 }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Author Name</FormLabel>
                  <Input
                    value={formData.authorName}
                    onChange={(e) =>
                      setFormData({ ...formData, authorName: e.target.value })
                    }
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
                    placeholder="Enter author name"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Category</FormLabel>
                  <Select
                    value={formData.category?._id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: categories?.find((c) => c._id === e.target.value),
                      })
                    }
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
                    <option value="">Select category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Language</FormLabel>

                  <Select
                    value={formData.language?._id || ""}
                    onChange={(e) => {
                      console.log("Language dropdown changed:", e.target.value);
                      console.log("Available languages:", languages);
                      const selectedLang = languages?.find((l) => l._id === e.target.value);
                      console.log("Selected language:", selectedLang);
                      setFormData({
                        ...formData,
                        language: selectedLang || { _id: "", name: "", code: "" },
                      });
                    }}
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
                    <option value="">Select language</option>
                    {languages?.map((language) => (
                      <option key={language._id} value={language._id}>
                        {language.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Price</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="Leave empty for free content"
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

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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
                    placeholder="Enter song description"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>YouTube URL</FormLabel>
                  <Input
                    type="url"
                    value={formData.youtubeUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/watch?v=..."
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

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Tags</FormLabel>
                  <VStack align="stretch" spacing={3}>
                    <Flex gap={2}>
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleTagInputKeyPress}
                        placeholder="Enter a tag and press Enter"
                        bg={inputBg}
                        color={inputColor}
                        borderColor={inputBorderColor}
                        _hover={{ borderColor: inputFocusBorderColor }}
                        _focus={{ 
                          borderColor: inputFocusBorderColor, 
                          boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                        }}
                        transition="all 0.2s"
                        flex={1}
                      />
                      <Button
                        onClick={() => handleAddTag()}
                        colorScheme="blue"
                        isDisabled={!tagInput.trim() || formData.tags?.includes(tagInput.trim())}
                        minW="80px"
                      >
                        Add
                      </Button>
                    </Flex>
                    {formData.tags && formData.tags.length > 0 && (
                      <Box>
                        <Text fontSize="sm" color="blue.500" fontWeight="semibold" mb={2}>
                          Current Tags:
                        </Text>
                        <Wrap spacing={2}>
                          {formData.tags.map((tag, index) => (
                            <WrapItem key={index}>
                              <Tag
                                size="md"
                                colorScheme="blue"
                                borderRadius="full"
                              >
                                <TagLabel>{tag}</TagLabel>
                                <TagCloseButton 
                                  onClick={() => handleRemoveTag(tag)}
                                  _hover={{ bg: "blue.600" }}
                                />
                              </Tag>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Box>
                    )}
                  </VStack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Lyrics</FormLabel>
                  <Textarea
                    value={formData.lyrics}
                    onChange={(e) =>
                      setFormData({ ...formData, lyrics: e.target.value })
                    }
                    minHeight="200px"
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
                    placeholder="Enter song lyrics"
                  />
                </FormControl>

                <Box borderWidth="1px" borderRadius="lg" p={6} mt={4} bg={mediaFilesBg}>
                  <Heading size="md" mb={4} color="blue.500" fontWeight="semibold">
                    Media Files
                  </Heading>

                  <FormControl>
                    <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Select Media Files</FormLabel>
                    <Select
                      value=""
                      onChange={(e) => handleMediaSelect(e.target.value)}
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
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                      size="lg"
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
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                      size="lg"
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
                      <FormLabel color="blue.500" fontWeight="semibold">
                        Selected Files ({formData.mediaFiles.length}):
                      </FormLabel>
                      {formData.mediaFiles.map((mediaId) => {
                        const media = mediaFiles.find((m) => m._id === mediaId);
                        if (!media) {
                          return (
                            <Flex key={mediaId} alignItems="center" gap={2} mb={2}>
                              <Text color="red.400" fontSize="sm">
                                Media file not found (ID: {mediaId})
                              </Text>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleMediaSelect(mediaId)}
                                _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                                transition="all 0.2s"
                              >
                                Remove
                              </Button>
                            </Flex>
                          );
                        }
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
                              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                              transition="all 0.2s"
                            >
                              Remove
                            </Button>
                          </Flex>
                        );
                      })}
                    </Box>
                  )}
                </Box>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/songs")}
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
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                  >
                    {id ? "Update Song" : "Create Song"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
        </VStack>
      )}
    </Box>
  );
};

export default SongFormPage;
