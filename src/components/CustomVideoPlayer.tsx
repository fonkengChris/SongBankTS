import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  AspectRatio,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useToast,
  Link,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

interface CustomVideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleError = (e: Event) => {
      const errorMessage = !isMP4 
        ? "Only MP4 files are supported. Please ensure your video is in MP4 format."
        : "Error loading video. Please try again or download the file.";
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [isMP4, onError]);

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

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  // If it's not an MP4 file or there's an error, show download option
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
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
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

  // For MP4 videos, show the video player
  return (
    <Box position="relative" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <AspectRatio ratio={16 / 9}>
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          Your browser does not support the video tag.
        </video>
      </AspectRatio>

      {/* Loading overlay */}
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

      {/* Video controls */}
      {showControls && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.800"
          p={4}
          color="white"
        >
          <VStack spacing={2}>
            {/* Progress bar */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              style={{
                width: '100%',
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255, 255, 255, 0.3)',
                outline: 'none',
                cursor: 'pointer',
              }}
            />

            {/* Control buttons */}
            <HStack justify="space-between" w="100%">
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  onClick={togglePlay}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <Icon as={isPlaying ? FaPause : FaPlay} />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  onClick={toggleMute}
                  _hover={{ bg: 'whiteAlpha.200' }}
                >
                  <Icon as={isMuted ? FaVolumeMute : FaVolumeUp} />
                </Button>

                <Text fontSize="sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Text>
              </HStack>

              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  onClick={handleDownload}
                  _hover={{ bg: 'whiteAlpha.200' }}
                  leftIcon={<FaDownload />}
                >
                  Download
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default CustomVideoPlayer; 