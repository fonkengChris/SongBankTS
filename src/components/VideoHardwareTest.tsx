import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack, Badge, Select } from "@chakra-ui/react";

interface VideoHardwareTestProps {
  videoUrl: string;
}

const VideoHardwareTest: React.FC<VideoHardwareTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderMode, setRenderMode] = useState('hardware');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Video Hardware Test - Mode:', renderMode);

    const handlePlay = () => {
      console.log('▶️ Video Hardware Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video Hardware Test - Paused');
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    video.src = videoUrl;

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, renderMode]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Play error:', err);
      });
    }
  };

  const getVideoStyle = (): React.CSSProperties => {
    switch (renderMode) {
      case 'hardware':
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          transform: 'translateZ(0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        };
      case 'software':
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          transform: 'none',
          willChange: 'auto'
        };
      case 'canvas':
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
          imageRendering: 'pixelated'
        };
      default:
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        };
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" color="purple.400">
        Video Hardware Test
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="purple.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        <VStack spacing={4}>
          <HStack spacing={2} wrap="wrap">
            <Text fontSize="sm" color="gray.300">Render Mode:</Text>
            <Select 
              size="sm" 
              value={renderMode}
              onChange={(e) => setRenderMode(e.target.value)}
              w="150px"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="canvas">Canvas</option>
              <option value="default">Default</option>
            </Select>
          </HStack>

          <Box 
            position="relative" 
            w="100%" 
            h="300px" 
            bg="black"
            border="2px solid"
            borderColor="purple.300"
            borderRadius="md"
            overflow="hidden"
          >
            <video
              ref={videoRef}
              style={getVideoStyle()}
              controls={true}
              preload="auto"
              muted={false}
              playsInline={true}
            >
              Your browser does not support the video tag.
            </video>
          </Box>
          
          <VStack spacing={2}>
            <Button 
              onClick={togglePlay}
              colorScheme={isPlaying ? "red" : "green"}
              size="sm"
            >
              {isPlaying ? "Pause" : "Play"}
            </Button>
            
            <HStack spacing={2}>
              <Badge colorScheme="purple">Mode: {renderMode}</Badge>
              <Badge colorScheme={isPlaying ? "green" : "gray"}>
                {isPlaying ? "Playing" : "Paused"}
              </Badge>
            </HStack>
            
            <Text fontSize="xs" color="gray.400">
              Testing hardware acceleration and rendering modes
            </Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default VideoHardwareTest; 