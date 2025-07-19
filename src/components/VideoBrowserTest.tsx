import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack, Badge, Alert, AlertIcon } from "@chakra-ui/react";

interface VideoBrowserTestProps {
  videoUrl: string;
}

const VideoBrowserTest: React.FC<VideoBrowserTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [browserInfo, setBrowserInfo] = useState('');

  useEffect(() => {
    // Detect browser info
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    setBrowserInfo(browser);
    
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Video Browser Test - Browser:', browser);

    const handlePlay = () => {
      console.log('▶️ Video Browser Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video Browser Test - Paused');
      setIsPlaying(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    video.src = videoUrl;

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

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

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" color="orange.400">
        Video Browser Test
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="orange.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        <VStack spacing={4}>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="bold">Browser: {browserInfo}</Text>
              <Text fontSize="sm">Testing browser-specific video rendering</Text>
            </Box>
          </Alert>

          <Box 
            position="relative" 
            w="100%" 
            h="300px" 
            bg="black"
            border="2px solid"
            borderColor="orange.300"
            borderRadius="md"
            overflow="hidden"
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
              controls={true}
              preload="auto"
              muted={false}
              playsInline={true}
              {...{
                'webkit-playsinline': 'true',
                'x5-playsinline': 'true'
              }}
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
              <Badge colorScheme="orange">Browser: {browserInfo}</Badge>
              <Badge colorScheme={isPlaying ? "green" : "gray"}>
                {isPlaying ? "Playing" : "Paused"}
              </Badge>
            </HStack>
            
            <Text fontSize="xs" color="gray.400">
              Testing browser-specific video attributes and rendering
            </Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};

export default VideoBrowserTest; 