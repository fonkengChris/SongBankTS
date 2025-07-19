import React, { useEffect, useRef, useState } from "react";
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
  Spinner,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface EnhancedVideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      fluid: true,
      responsive: true,
      poster: thumbnailUrl,
      sources: [{
        src: videoUrl,
        type: 'video/mp4'
      }],
      html5: {
        vhs: {
          overrideNative: true
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
      }
    });

    playerRef.current = player;

    // Event listeners
    player.on('loadstart', () => {
      setIsLoading(true);
      setError(null);
    });

    player.on('canplay', () => {
      setIsLoading(false);
      setIsPlaying(false);
    });

    player.on('play', () => {
      setIsPlaying(true);
    });

    player.on('pause', () => {
      setIsPlaying(false);
    });

    player.on('ended', () => {
      setIsPlaying(false);
    });

    player.on('error', (err: any) => {
      console.error('Video.js error:', err);
      setIsLoading(false);
      
      let errorMessage = "Error loading video";
      
      if (err.code === 4) {
        errorMessage = "Video format not supported. Please ensure the video is in MP4 format.";
      } else if (err.code === 3) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    });

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoUrl, thumbnailUrl, onError]);

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

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play().catch((err: any) => {
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
    }
  };

  // If there's an error or not MP4, show fallback
  if (error || !isMP4) {
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

  return (
    <Box position="relative">
      <AspectRatio ratio={16 / 9}>
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-default-skin vjs-big-play-centered"
            style={{ width: '100%', height: '100%' }}
          >
            <p className="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a
              web browser that supports HTML5 video.
            </p>
          </video>
        </div>
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
          zIndex={10}
        >
          <HStack spacing={2}>
            <Spinner size="sm" />
            <Text>Loading video...</Text>
          </HStack>
        </Box>
      )}

      {/* MP4 Format Notice */}
      <Alert status="info" borderRadius="md" mt={4}>
        <AlertIcon />
        <Box>
          <AlertTitle>MP4 Video</AlertTitle>
          <AlertDescription>
            Playing MP4 video with enhanced controls and browser compatibility.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Custom Controls Overlay (optional) */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        bg="blackAlpha.800"
        p={4}
        color="white"
        opacity={0}
        _hover={{ opacity: 1 }}
        transition="opacity 0.3s"
        zIndex={5}
      >
        <HStack justify="space-between">
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
      </Box>
    </Box>
  );
};

export default EnhancedVideoPlayer; 