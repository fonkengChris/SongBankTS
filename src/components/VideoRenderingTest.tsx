import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack, Badge } from "@chakra-ui/react";

interface VideoRenderingTestProps {
  videoUrl: string;
}

const VideoRenderingTest: React.FC<VideoRenderingTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderMethod, setRenderMethod] = useState('default');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Video Rendering Test - Method:', renderMethod);

    const handlePlay = () => {
      console.log('▶️ Video Rendering Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video Rendering Test - Paused');
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    video.src = videoUrl;

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl, renderMethod]);

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
    switch (renderMethod) {
      case 'absolute':
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
      case 'relative':
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block',
          position: 'relative',
          zIndex: 1
        };
      case 'flex':
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      default:
        return {
          width: '100%',
          height: '100%',
          objectFit: 'contain' as const,
          backgroundColor: '#000000',
          display: 'block'
        };
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" color="pink.400">
        Video Rendering Test
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="pink.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        <HStack spacing={2} mb={4} wrap="wrap">
          <Button 
            size="sm" 
            colorScheme={renderMethod === 'default' ? 'blue' : 'gray'}
            onClick={() => setRenderMethod('default')}
          >
            Default
          </Button>
          <Button 
            size="sm" 
            colorScheme={renderMethod === 'absolute' ? 'blue' : 'gray'}
            onClick={() => setRenderMethod('absolute')}
          >
            Absolute
          </Button>
          <Button 
            size="sm" 
            colorScheme={renderMethod === 'relative' ? 'blue' : 'gray'}
            onClick={() => setRenderMethod('relative')}
          >
            Relative
          </Button>
          <Button 
            size="sm" 
            colorScheme={renderMethod === 'flex' ? 'blue' : 'gray'}
            onClick={() => setRenderMethod('flex')}
          >
            Flex
          </Button>
        </HStack>

        <Box 
          position="relative" 
          w="100%" 
          h="300px" 
          bg="black"
          border="2px solid"
          borderColor="pink.300"
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
        
        <VStack spacing={2} mt={4}>
          <Button 
            onClick={togglePlay}
            colorScheme={isPlaying ? "red" : "green"}
            size="sm"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <HStack spacing={2}>
            <Badge colorScheme="pink">Method: {renderMethod}</Badge>
            <Badge colorScheme={isPlaying ? "green" : "gray"}>
              {isPlaying ? "Playing" : "Paused"}
            </Badge>
          </HStack>
          
          <Text fontSize="xs" color="gray.400">
            URL: {videoUrl}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default VideoRenderingTest; 