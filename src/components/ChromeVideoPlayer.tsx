import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  HStack,
  Badge,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

interface ChromeVideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

const ChromeVideoPlayer: React.FC<ChromeVideoPlayerProps> = ({
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Chrome Video Player - Initializing');

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      console.log('🎬 Chrome Video Player - Metadata loaded');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleError = (e: Event) => {
      const errorMessage = "Error loading video in Chrome. Please try refreshing the page.";
      setError(errorMessage);
      setIsLoading(false);
      onError?.(errorMessage);
      console.error('🎬 Chrome Video Player - Error:', e);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      console.log('🎬 Chrome Video Player - Can play');
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('🎬 Chrome Video Player - Playing');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('🎬 Chrome Video Player - Paused');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set video source
    video.src = videoUrl;

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, onError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('Chrome Video Player - Play error:', err);
        setError('Failed to play video. Please try again.');
      });
    }
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

  if (error) {
    return (
      <Box
        border="2px dashed"
        borderColor="red.300"
        borderRadius="lg"
        p={6}
        textAlign="center"
        bg="red.50"
      >
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text>{error}</Text>
        </Alert>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <Text fontWeight="bold">Chrome-Optimized Video Player</Text>
          <Text fontSize="sm">Optimized for Chrome browser rendering</Text>
        </Box>
      </Alert>

      <Box 
        position="relative" 
        w="100%" 
        h="400px" 
        bg="black"
        borderRadius="lg"
        overflow="hidden"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain' as const,
            backgroundColor: '#000000',
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
          preload="auto"
          controls={false}
          muted={isMuted}
          playsInline={true}
          poster={thumbnailUrl}
          {...{
            'webkit-playsinline': 'true',
            'x5-playsinline': 'true',
            'x5-video-player-type': 'h5',
            'x5-video-player-fullscreen': 'false'
          }}
        >
          Your browser does not support the video tag.
        </video>

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
            zIndex={10}
          >
            <Text>Loading...</Text>
          </Box>
        )}

        {/* Custom controls */}
        {showControls && (
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            bg="blackAlpha.800"
            p={4}
            color="white"
            zIndex={10}
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
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    onClick={toggleMute}
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                  </Button>

                  <Text fontSize="sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Chrome indicator */}
        <Box 
          position="absolute" 
          top={2} 
          right={2} 
          bg="blue.500" 
          color="white" 
          px={2} 
          py={1} 
          borderRadius="sm" 
          fontSize="xs"
          zIndex={10}
        >
          Chrome Optimized
        </Box>
      </Box>

      <HStack spacing={2} justify="center">
        <Badge colorScheme="blue">Chrome</Badge>
        <Badge colorScheme={isPlaying ? "green" : "gray"}>
          {isPlaying ? "Playing" : "Paused"}
        </Badge>
        <Badge colorScheme={isMuted ? "red" : "green"}>
          {isMuted ? "Muted" : "Unmuted"}
        </Badge>
      </HStack>
    </VStack>
  );
};

export default ChromeVideoPlayer; 