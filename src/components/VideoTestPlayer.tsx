import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

interface VideoTestPlayerProps {
  videoUrl: string;
  title: string;
}

const VideoTestPlayer: React.FC<VideoTestPlayerProps> = ({ videoUrl, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🔍 Testing video URL:', videoUrl);

    const handleLoadStart = () => {
      console.log('📹 Video load started');
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      console.log('✅ Video metadata loaded, duration:', video.duration);
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      console.log('🎬 Video can play');
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video error:', e);
      console.error('❌ Video error details:', video.error);
      setIsLoading(false);
      
      let errorMessage = "Unknown error";
      if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = "Video loading aborted";
            break;
          case 2:
            errorMessage = "Network error";
            break;
          case 3:
            errorMessage = "Video decoding failed";
            break;
          case 4:
            errorMessage = "Video format not supported";
            break;
          default:
            errorMessage = video.error.message || "Unknown error";
        }
      }
      
      setError(errorMessage);
    };

    const handlePlay = () => {
      console.log('▶️ Video started playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      setIsPlaying(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);

    // Set video source
    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('Error playing video:', err);
        setError(err.message);
      });
    }
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <VStack spacing={4} align="stretch">
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Video Test Player</AlertTitle>
          <AlertDescription>
            Testing video playback with detailed logging and error handling.
          </AlertDescription>
        </Box>
      </Alert>

      <Box border="2px solid" borderColor="blue.300" borderRadius="lg" p={4}>
        <VStack spacing={3}>
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
          
          <Text fontSize="sm" color="gray.600" textAlign="center">
            URL: {videoUrl}
          </Text>

          <Box position="relative" w="100%" maxW="600px">
            <video
              ref={videoRef}
              style={{ 
                width: '100%', 
                height: 'auto', 
                maxHeight: '400px',
                border: '1px solid #ccc',
                borderRadius: '8px'
              }}
              controls={true}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>

            {isLoading && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="blackAlpha.700"
                color="white"
                px={4}
                py={2}
                borderRadius="md"
              >
                <Text>Loading...</Text>
              </Box>
            )}
          </Box>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Playback Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Box>
            </Alert>
          )}

          <HStack spacing={4}>
            <Button
              leftIcon={isPlaying ? <FaPause /> : <FaPlay />}
              colorScheme="blue"
              onClick={togglePlay}
              isDisabled={!!error}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button
              leftIcon={<FaDownload />}
              variant="outline"
              onClick={handleDownload}
            >
              Download
            </Button>

            <Button
              leftIcon={<FaExternalLinkAlt />}
              variant="outline"
              onClick={handleOpenInNewTab}
            >
              Open in Tab
            </Button>
          </HStack>

          <HStack spacing={4} fontSize="sm" color="gray.600">
            <Text>Duration: {formatTime(duration)}</Text>
            <Text>Current: {formatTime(currentTime)}</Text>
            <Badge colorScheme={error ? "red" : isLoading ? "yellow" : "green"}>
              {error ? "Error" : isLoading ? "Loading" : "Ready"}
            </Badge>
          </HStack>
        </VStack>
      </Box>

      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Debug Information</AlertTitle>
          <AlertDescription>
            Check the browser console for detailed video loading logs. This will help identify the exact issue.
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default VideoTestPlayer; 