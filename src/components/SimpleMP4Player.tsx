import React, { useState, useRef } from "react";
import {
  Box,
  AspectRatio,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useToast,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FaDownload, FaExternalLinkAlt, FaPlay, FaPause } from "react-icons/fa";

interface SimpleMP4PlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

const SimpleMP4Player: React.FC<SimpleMP4PlayerProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');

  const handleError = () => {
    const errorMessage = !isMP4 
      ? "Only MP4 files are supported. Please ensure your video is in MP4 format."
      : "Error loading video. Please try again or download the file.";
    setError(errorMessage);
    onError?.(errorMessage);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        toast({
          title: "Error playing video",
          description: "This video may not be supported in your browser.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
    }
    setIsPlaying(!isPlaying);
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

  // If it's not MP4 or there's an error, show fallback
  if (!isMP4 || error) {
    return (
      <Box
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg="gray.50"
      >
        <VStack spacing={4}>
          {thumbnailUrl && (
            <Box maxW="300px">
              <img 
                src={thumbnailUrl} 
                alt={title}
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Box>
          )}
          
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="bold">
              {title}
            </Text>
            
            {!isMP4 && (
              <Badge colorScheme="red">
                Non-MP4 Format
              </Badge>
            )}
            
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Playback Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Box>
              </Alert>
            )}
            
            <Text fontSize="sm" color="gray.600">
              {!isMP4 ? "Only MP4 format is supported." : "This video requires downloading to play."}
            </Text>
          </VStack>

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

  // For MP4 videos, show the simple player
  return (
    <VStack spacing={4} align="stretch">
      <Alert status="success" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>MP4 Video Player</AlertTitle>
          <AlertDescription>
            Simple HTML5 video player for MP4 files with basic controls.
          </AlertDescription>
        </Box>
      </Alert>

      <Box position="relative">
        <AspectRatio ratio={16 / 9}>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={thumbnailUrl}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={handleError}
            controls
          >
            Your browser does not support the video tag.
          </video>
        </AspectRatio>

        {/* Custom play/pause overlay */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          opacity={0}
          _hover={{ opacity: 1 }}
          transition="opacity 0.3s"
          zIndex={5}
        >
          <Button
            size="lg"
            colorScheme="blue"
            borderRadius="full"
            onClick={togglePlay}
            bg="blackAlpha.600"
            color="white"
            _hover={{ bg: 'blackAlpha.700' }}
          >
            <Icon as={isPlaying ? FaPause : FaPlay} boxSize={6} />
          </Button>
        </Box>
      </Box>

      {/* Download button */}
      <HStack justify="center" spacing={4}>
        <Button
          leftIcon={<FaDownload />}
          colorScheme="blue"
          variant="outline"
          onClick={handleDownload}
        >
          Download MP4
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
  );
};

export default SimpleMP4Player; 