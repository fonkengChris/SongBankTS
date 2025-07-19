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
import { FaClock } from "react-icons/fa";
import VideoGrid from "../components/VideoGrid";
import useVideos from "../hooks/useVideos";
import Video from "../entities/Video";
import SmartVideoPlayer from "../components/SmartVideoPlayer";
import VideoDebugger from "../components/VideoDebugger";
import VideoTestPlayer from "../components/VideoTestPlayer";
import SimpleVideoTest from "../components/SimpleVideoTest";
import VideoFormatTest from "../components/VideoFormatTest";
import DirectVideoTest from "../components/DirectVideoTest";
import VideoRenderingTest from "../components/VideoRenderingTest";

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

  const handleVideoError = (error: string) => {
    console.error("Video playback error:", error);
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
            MP4 video guides
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

        {/* Video Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800" color="white">
            <ModalHeader>{selectedVideo?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedVideo && (
                <VStack spacing={4} align="stretch">
                  <SmartVideoPlayer
                    videoId={selectedVideo._id}
                    videoUrl={selectedVideo.url}
                    title={selectedVideo.title}
                    thumbnailUrl={selectedVideo.thumbnailUrl}
                    onError={handleVideoError}
                  />

                  {/* Video Debugger for development */}
                  {process.env.NODE_ENV === 'development' && (
                    <VideoDebugger
                      videoUrl={selectedVideo.url}
                      title={selectedVideo.title}
                    />
                  )}

                  {/* Video Test Player for debugging */}
                  {process.env.NODE_ENV === 'development' && (
                    <VideoTestPlayer
                      videoUrl={selectedVideo.url}
                      title={selectedVideo.title}
                    />
                  )}

                  {/* Simple Video Test */}
                  {process.env.NODE_ENV === 'development' && (
                    <SimpleVideoTest
                      videoUrl={selectedVideo.url}
                    />
                  )}

                  {/* Video Format Test */}
                  {process.env.NODE_ENV === 'development' && (
                    <VideoFormatTest
                      videoUrl={selectedVideo.url}
                    />
                  )}

                  {/* Direct Video Test */}
                  {process.env.NODE_ENV === 'development' && (
                    <DirectVideoTest
                      videoUrl={selectedVideo.url}
                    />
                  )}

                  {/* Video Rendering Test */}
                  {process.env.NODE_ENV === 'development' && (
                    <VideoRenderingTest
                      videoUrl={selectedVideo.url}
                    />
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
