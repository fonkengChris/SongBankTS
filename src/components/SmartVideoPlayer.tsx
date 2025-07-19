import React from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
} from "@chakra-ui/react";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import EnhancedVideoPlayer from "./EnhancedVideoPlayer";
import ChromeVideoPlayer from "./ChromeVideoPlayer";
import HardwareVideoPlayer from "./HardwareVideoPlayer";

interface SmartVideoPlayerProps {
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

const SmartVideoPlayer: React.FC<SmartVideoPlayerProps> = ({
  videoId,
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');
  
  // Detect Chrome browser
  const isChrome = () => {
    const userAgent = navigator.userAgent;
    return userAgent.includes('Chrome') && !userAgent.includes('Edg');
  };

  // Detect if it's a desktop machine
  const isDesktop = () => {
    return !navigator.userAgent.includes('Mobile') && !navigator.userAgent.includes('Android') && !navigator.userAgent.includes('iPhone');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(videoUrl, '_blank');
  };

  // If it's not MP4, show error
  if (!isMP4) {
    return (
      <Box
        border="2px dashed"
        borderColor="red.300"
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg="red.50"
      >
        <VStack spacing={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Unsupported Video Format</AlertTitle>
              <AlertDescription>
                Only MP4 video format is supported. Please ensure your video is in MP4 format.
              </AlertDescription>
            </Box>
          </Alert>
          
          <HStack spacing={4}>
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              onClick={handleDownload}
            >
              Download Video
            </Button>
            
            <Button
              leftIcon={<FaExternalLinkAlt />}
              variant="outline"
              onClick={handleOpenInNewTab}
            >
              Open in New Tab
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  }

  // For MP4 videos, use the appropriate player based on browser
  return (
    <VStack spacing={4} align="stretch">
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>MP4 Video Ready</AlertTitle>
          <AlertDescription>
            Your MP4 video is ready for playback in the browser.
          </AlertDescription>
        </Box>
      </Alert>
      
      {isDesktop() ? (
        <HardwareVideoPlayer
          videoUrl={videoUrl}
          title={title}
          thumbnailUrl={thumbnailUrl}
          onError={onError}
        />
      ) : isChrome() ? (
        <ChromeVideoPlayer
          videoUrl={videoUrl}
          title={title}
          thumbnailUrl={thumbnailUrl}
          onError={onError}
        />
      ) : (
        <EnhancedVideoPlayer
          videoUrl={videoUrl}
          title={title}
          thumbnailUrl={thumbnailUrl}
          onError={onError}
        />
      )}
    </VStack>
  );
};

export default SmartVideoPlayer; 