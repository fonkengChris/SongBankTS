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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const toast = useToast();

  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Setting video source:', videoUrl);

    const handleLoadedMetadata = () => {
      console.log('Video metadata loaded, duration:', video.duration);
      setDuration(video.duration);
      setIsLoading(false);
      setError(null);
      setVideoLoaded(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleError = (e: Event) => {
      console.error('Video error:', e);
      console.error('Video error details:', video.error);
      setIsLoading(false);
      
      let errorMessage = "Error loading video. Please check the video URL and format.";
      
      // Check if it's a network error
      if (video.networkState === 3) {
        errorMessage = "Network error. The video may not be accessible or may be blocked.";
      } else if (video.readyState === 0) {
        errorMessage = "Video not loaded. Please check the video URL.";
      } else if (video.error) {
        switch (video.error.code) {
          case 1:
            errorMessage = "Video loading aborted.";
            break;
          case 2:
            errorMessage = "Network error while loading video.";
            break;
          case 3:
            errorMessage = "Video decoding failed. File may be corrupted.";
            break;
          case 4:
            errorMessage = "Video format not supported.";
            break;
          default:
            errorMessage = `Video error: ${video.error.message}`;
        }
      }
      
      setError(errorMessage);
      onError?.(errorMessage);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
      setIsLoading(false);
      setError(null);
    };

    const handleCanPlayThrough = () => {
      console.log('Video can play through');
      setVideoLoaded(true);
    };

    const handleLoadStart = () => {
      console.log('Video load started');
      setIsLoading(true);
      setError(null);
    };

    const handlePlay = () => {
      console.log('Video play started');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('Video ended');
      setIsPlaying(false);
    };

    // Add event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlayThrough);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // Set video source with error handling
    console.log('🔍 Setting video source:', videoUrl);
    
    // Try setting source with error handling
    try {
      video.src = videoUrl;
      video.load();
      
      // Force a reload after a short delay
      setTimeout(() => {
        if (video.readyState === 0) {
          console.log('🔄 Forcing video reload...');
          video.load();
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error setting video source:', error);
      setError('Failed to set video source');
    }

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlayThrough);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoUrl, onError]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Toggle play, current state:', isPlaying);

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
    <Box position="relative" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <AspectRatio ratio={16 / 9}>
        <Box position="relative" w="100%" h="100%" bg="black">
          <video
            ref={videoRef}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              backgroundColor: '#000000',
              display: 'block'
            }}
            preload="auto"
            controls={true}
            muted={false}
            playsInline={true}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Visual indicator that video container exists */}
          <Box 
            position="absolute" 
            top={2} 
            left={2} 
            bg="red.500" 
            color="white" 
            px={2} 
            py={1} 
            borderRadius="sm" 
            fontSize="xs"
            zIndex={10}
          >
            Video Container
          </Box>
          
          {/* Test pattern to verify video area */}
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
            Test Pattern
          </Box>
        </Box>
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

      {/* Temporarily disabled custom controls to test native controls */}
      {/* Video controls */}
      {false && showControls && (
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg="blackAlpha.800"
          p={4}
          color="white"
          zIndex={5}
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

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <Box position="absolute" top={2} right={2} bg="blackAlpha.700" color="white" p={2} borderRadius="md" fontSize="xs" zIndex={15}>
          <Text>Loaded: {videoLoaded ? 'Yes' : 'No'}</Text>
          <Text>Duration: {duration.toFixed(2)}s</Text>
          <Text>Playing: {isPlaying ? 'Yes' : 'No'}</Text>
          <Text>Error: {error || 'None'}</Text>
          <Text>Video Element: {videoRef.current ? 'Exists' : 'Missing'}</Text>
          <Text>Video ReadyState: {videoRef.current?.readyState || 'N/A'}</Text>
          <Text>Video NetworkState: {videoRef.current?.networkState || 'N/A'}</Text>
        </Box>
      )}

      {/* MP4 Format Notice */}
      <Alert status="success" borderRadius="md" mt={4}>
        <AlertIcon />
        <Box>
          <AlertTitle>MP4 Video Ready</AlertTitle>
          <AlertDescription>
            Your MP4 video is ready for playback with native HTML5 controls.
          </AlertDescription>
        </Box>
      </Alert>
    </Box>
  );
};

export default EnhancedVideoPlayer; 