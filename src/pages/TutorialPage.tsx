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
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaClock, FaYoutube } from "react-icons/fa";
import VideoGrid from "../components/VideoGrid";
import useVideos from "../hooks/useVideos";
import Video from "../entities/Video";
import YouTube from "react-youtube";

const TutorialPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const videoQuery = {};

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
      case "regular":
        return "green";
      case "admin":
        return "red";
      default:
        return "gray";
    }
  };

  const getYoutubeVideoId = (url?: string): string | undefined => {
    if (!url) return undefined;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            App Tutorials
          </Heading>
          <Text fontSize="lg" color="gray.500">
            Learn how to use SheetMusicLibrary effectively with our step-by-step
            YouTube video guides
          </Text>
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

        {/* YouTube Video Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800" color="white">
            <ModalHeader>{selectedVideo?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedVideo && (
                <VStack spacing={4} align="stretch">
                  {/* YouTube Player */}
                  {selectedVideo.url && getYoutubeVideoId(selectedVideo.url) && (
                    <Box width="100%" display="flex" justifyContent="center">
                      <Box width="100%">
                        <YouTube
                          videoId={getYoutubeVideoId(selectedVideo.url)}
                          opts={{
                            width: "100%",
                            height: "300",
                            playerVars: {
                              autoplay: 0,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  )}

                  <VStack align="start" spacing={3}>
                    <Text fontSize="lg" fontWeight="semibold">
                      {selectedVideo.description}
                    </Text>

                    <HStack spacing={2} wrap="wrap">
                      <Badge colorScheme={getLevelColor(selectedVideo.level)}>
                        {selectedVideo.level.charAt(0).toUpperCase() +
                          selectedVideo.level.slice(1)}
                      </Badge>
                      <Badge colorScheme="red" variant="outline">
                        <HStack spacing={1}>
                          <Icon as={FaYoutube} boxSize={3} />
                          <Text>YouTube Tutorial</Text>
                        </HStack>
                      </Badge>
                    </HStack>

                    {selectedVideo.duration && (
                    <HStack spacing={4} color="gray.500" fontSize="sm">
                        <Flex align="center" gap={1}>
                          <Icon as={FaClock} boxSize={3} />
                          <Text>{formatDuration(selectedVideo.duration)}</Text>
                        </Flex>
                    </HStack>
                    )}

                    {selectedVideo.createdAt && (
                      <Text color="gray.400" fontSize="sm">
                        Created: {new Date(selectedVideo.createdAt).toLocaleDateString()}
                        </Text>
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
