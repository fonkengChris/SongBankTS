import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaClock, FaExternalLinkAlt, FaYoutube } from "react-icons/fa";
import VideoGrid from "../components/VideoGrid";
import useVideos from "../hooks/useVideos";
import Video from "../entities/Video";

const TutorialPage = () => {
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
    // Open YouTube link in new tab
    if (video.url) {
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
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

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
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
      </VStack>
    </Container>
  );
};

export default TutorialPage;
