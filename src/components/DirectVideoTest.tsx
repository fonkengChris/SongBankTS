import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

interface DirectVideoTestProps {
  videoUrl: string;
}

const DirectVideoTest: React.FC<DirectVideoTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Direct Video Test - Setting source:', videoUrl);

    const handlePlay = () => {
      console.log('▶️ Direct Video Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Direct Video Test - Paused');
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
      <Text fontSize="lg" fontWeight="bold" color="cyan.400">
        Direct Video Test (No Styling)
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="cyan.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        {/* Direct video element with minimal styling */}
        <video
          ref={videoRef}
          controls={true}
          preload="auto"
          muted={false}
          playsInline={true}
          style={{
            width: '100%',
            maxWidth: '600px',
            height: 'auto',
            border: '2px solid lime',
            backgroundColor: 'purple'
          }}
        >
          Your browser does not support the video tag.
        </video>
        
        <VStack spacing={2} mt={4}>
          <Button 
            onClick={togglePlay}
            colorScheme={isPlaying ? "red" : "green"}
            size="sm"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Text fontSize="xs" color="gray.400">
            URL: {videoUrl}
          </Text>
          
          <Text fontSize="xs" color="gray.400">
            Status: {isPlaying ? "Playing" : "Paused"}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default DirectVideoTest; 