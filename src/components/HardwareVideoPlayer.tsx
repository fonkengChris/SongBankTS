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
  Select,
  Spinner,
} from "@chakra-ui/react";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCog } from "react-icons/fa";

interface HardwareVideoPlayerProps {
  videoUrl: string;
  title: string;
  thumbnailUrl?: string;
  onError?: (error: string) => void;
}

type RenderingMode = 'auto' | 'software' | 'hardware' | 'canvas' | 'webgl';

const HardwareVideoPlayer: React.FC<HardwareVideoPlayerProps> = ({
  videoUrl,
  title,
  thumbnailUrl,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renderingMode, setRenderingMode] = useState<RenderingMode>('auto');
  const [videoVisible, setVideoVisible] = useState(false);
  const [useCanvas, setUseCanvas] = useState(false);

  // Detect hardware capabilities
  const detectHardwareCapabilities = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    return {
      hasWebGL: !!gl,
      hasHardwareAcceleration: !!gl,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
    };
  };

  const hardwareInfo = detectHardwareCapabilities();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🔧 Hardware Video Player - Initializing');
    console.log('🔧 Hardware Info:', hardwareInfo);

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      console.log('🔧 Hardware Video Player - Metadata loaded');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleError = (e: Event) => {
      console.error('🔧 Hardware Video Player - Error:', e);
      setIsLoading(false);
      
      let errorMessage = "Video rendering error. Trying alternative rendering mode...";
      setError(errorMessage);
      
      // Try switching to software rendering
      if (renderingMode === 'auto' || renderingMode === 'hardware') {
        console.log('🔄 Switching to software rendering...');
        setRenderingMode('software');
        setError(null);
      } else if (renderingMode === 'software') {
        console.log('🔄 Switching to canvas rendering...');
        setRenderingMode('canvas');
        setUseCanvas(true);
        setError(null);
      } else {
        errorMessage = "All rendering modes failed. Please try downloading the video.";
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setVideoVisible(true);
      console.log('🔧 Hardware Video Player - Can play');
    };

    const handlePlay = () => {
      setIsPlaying(true);
      console.log('🔧 Hardware Video Player - Playing');
    };

    const handlePause = () => {
      setIsPlaying(false);
      console.log('🔧 Hardware Video Player - Paused');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Set video source with rendering mode
    video.src = videoUrl;
    
    // Apply rendering mode specific settings
    if (renderingMode === 'software') {
      video.style.transform = 'translateZ(0)';
      video.style.willChange = 'auto';
    } else if (renderingMode === 'hardware') {
      video.style.transform = 'translateZ(0)';
      video.style.willChange = 'transform';
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, renderingMode, onError]);

  // Canvas rendering for problematic hardware
  useEffect(() => {
    if (!useCanvas || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const renderFrame = () => {
      if (video.paused || video.ended) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(renderFrame);
    };

    video.addEventListener('play', renderFrame);
    return () => video.removeEventListener('play', renderFrame);
  }, [useCanvas]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch((err) => {
        console.error('Hardware Video Player - Play error:', err);
        setError('Failed to play video. Trying alternative mode...');
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

  const handleRenderingModeChange = (mode: RenderingMode) => {
    setRenderingMode(mode);
    setError(null);
    setIsLoading(true);
    setVideoVisible(false);
    
    if (mode === 'canvas') {
      setUseCanvas(true);
    } else {
      setUseCanvas(false);
    }
  };

  if (error && renderingMode === 'canvas') {
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
          <Text fontWeight="bold">Hardware-Adaptive Video Player</Text>
          <Text fontSize="sm">
            Rendering Mode: {renderingMode} | WebGL: {hardwareInfo.hasWebGL ? 'Yes' : 'No'}
          </Text>
        </Box>
      </Alert>

      {/* Rendering Mode Selector */}
      <HStack spacing={2} align="center">
        <Text fontSize="sm" fontWeight="semibold">Rendering Mode:</Text>
        <Select
          size="sm"
          value={renderingMode}
          onChange={(e) => handleRenderingModeChange(e.target.value as RenderingMode)}
          maxW="200px"
        >
          <option value="auto">Auto</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="canvas">Canvas</option>
        </Select>
      </HStack>

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
        {useCanvas ? (
          // Canvas rendering
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain' as const,
              backgroundColor: '#000000',
              display: 'block'
            }}
          />
        ) : (
          // Standard video rendering
          <video
            ref={videoRef}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain' as const,
              backgroundColor: '#000000',
              display: videoVisible ? 'block' : 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              ...(renderingMode === 'software' && {
                transform: 'translateZ(0)',
                willChange: 'auto'
              }),
              ...(renderingMode === 'hardware' && {
                transform: 'translateZ(0)',
                willChange: 'transform'
              })
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
        )}

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

        {/* Hardware indicator */}
        <Box 
          position="absolute" 
          top={2} 
          right={2} 
          bg="purple.500" 
          color="white" 
          px={2} 
          py={1} 
          borderRadius="sm" 
          fontSize="xs"
          zIndex={10}
        >
          {renderingMode}
        </Box>
      </Box>

      <HStack spacing={2} justify="center" wrap="wrap">
        <Badge colorScheme="purple">{renderingMode}</Badge>
        <Badge colorScheme={isPlaying ? "green" : "gray"}>
          {isPlaying ? "Playing" : "Paused"}
        </Badge>
        <Badge colorScheme={isMuted ? "red" : "green"}>
          {isMuted ? "Muted" : "Unmuted"}
        </Badge>
        <Badge colorScheme={hardwareInfo.hasWebGL ? "green" : "red"}>
          WebGL: {hardwareInfo.hasWebGL ? "Yes" : "No"}
        </Badge>
      </HStack>
    </VStack>
  );
};

export default HardwareVideoPlayer; 