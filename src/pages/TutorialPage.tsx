import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaPlay, FaEye, FaHeart, FaClock } from "react-icons/fa";
import VideoGrid from "../components/VideoGrid";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import CategorySelector from "../components/CategorySelector";
import LanguageSelector from "../components/LanguageSelector";
import LevelSelector from "../components/LevelSelector";
import SortSelector from "../components/SortSelector";
import useVideos from "../hooks/useVideos";
import useCategories from "../hooks/useCategories";
import useLanguages from "../hooks/useLanguages";
import Video from "../entities/Video";

const TutorialPage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortOrder, setSortOrder] = useState("-createdAt");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: categories } = useCategories();
  const { data: languages } = useLanguages();

  const videoQuery = {
    categoryId: selectedCategoryId,
    languageId: selectedLanguageId,
    level: selectedLevel,
    sortOrder,
    searchText,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVideos(videoQuery);

  const videos = data?.pages.flatMap((page) => page.videos) || [];

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    onOpen();
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            Video Tutorials
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Learn music theory, techniques, and performance skills through our
            comprehensive video tutorials
          </Text>
        </Box>

        {/* Filters */}
        <Box
          bg="gray.800"
          p={6}
          borderRadius="lg"
          border="1px"
          borderColor="gray.700"
        >
          <VStack spacing={4}>
            <InputGroup>
              <InputLeftElement
                children={<BsSearch />}
                height={{ base: "48px", md: "56px" }}
                color="gray.400"
              />
              <Input
                borderRadius="full"
                placeholder="Search tutorials..."
                variant="filled"
                height={{ base: "48px", md: "56px" }}
                minH={{ base: "48px", md: "56px" }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="400"
                letterSpacing="0.01em"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                color="white"
                _placeholder={{
                  color: "gray.400",
                  fontWeight: "400",
                }}
                _focus={{
                  bg: "gray.600",
                  borderColor: "blue.400",
                  boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                }}
                _hover={{
                  bg: "gray.600",
                  borderColor: "gray.500",
                }}
                transition="all 0.2s ease"
              />
            </InputGroup>
            <HStack spacing={4} wrap="wrap" justify="center">
              <CategorySelector />
              <LanguageSelector />
              <LevelSelector
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
              />
              <SortSelector />
            </HStack>
          </VStack>
        </Box>

        {/* Video Grid */}
        <VideoGrid
          videos={videos}
          isLoading={isLoading}
          error={error?.message}
          onVideoClick={handleVideoClick}
        />

        {/* Load More Button */}
        {hasNextPage && (
          <Box textAlign="center">
            <Button
              onClick={() => fetchNextPage()}
              isLoading={isFetchingNextPage}
              colorScheme="blue"
              size="lg"
            >
              Load More Videos
            </Button>
          </Box>
        )}

        {/* Video Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800" color="white">
            <ModalHeader>{selectedVideo?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedVideo && (
                <VStack spacing={4} align="stretch">
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={selectedVideo.url}
                      title={selectedVideo.title}
                      allowFullScreen
                    />
                  </AspectRatio>

                  <VStack align="start" spacing={3}>
                    <Text fontSize="lg" fontWeight="semibold">
                      {selectedVideo.description}
                    </Text>

                    <HStack spacing={2} wrap="wrap">
                      <Badge colorScheme={getLevelColor(selectedVideo.level)}>
                        {selectedVideo.level.charAt(0).toUpperCase() +
                          selectedVideo.level.slice(1)}
                      </Badge>
                      {selectedVideo.category && (
                        <Badge colorScheme="blue" variant="outline">
                          {selectedVideo.category.title}
                        </Badge>
                      )}
                      {selectedVideo.language && (
                        <Badge colorScheme="purple" variant="outline">
                          {selectedVideo.language.name}
                        </Badge>
                      )}
                    </HStack>

                    <Text color="gray.400">By {selectedVideo.instructor}</Text>

                    <HStack spacing={4} color="gray.500" fontSize="sm">
                      <Flex align="center" gap={1}>
                        <Icon as={FaEye} boxSize={3} />
                        <Text>{selectedVideo.views || 0} views</Text>
                      </Flex>
                      <Flex align="center" gap={1}>
                        <Icon as={FaHeart} boxSize={3} />
                        <Text>{selectedVideo.likesCount || 0} likes</Text>
                      </Flex>
                      {selectedVideo.duration && (
                        <Flex align="center" gap={1}>
                          <Icon as={FaClock} boxSize={3} />
                          <Text>{formatDuration(selectedVideo.duration)}</Text>
                        </Flex>
                      )}
                    </HStack>

                    {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                      <Box>
                        <Text fontSize="sm" color="gray.400" mb={2}>
                          Tags:
                        </Text>
                        <HStack spacing={2} wrap="wrap">
                          {selectedVideo.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              colorScheme="gray"
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    )}
                  </VStack>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

export default TutorialPage;
