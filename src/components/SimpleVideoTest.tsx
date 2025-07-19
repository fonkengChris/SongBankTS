import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack } from "@chakra-ui/react";

interface SimpleVideoTestProps {
  videoUrl: string;
}

const SimpleVideoTest: React.FC<SimpleVideoTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Simple Video Test - Setting source:', videoUrl);

    const handleCanPlay = () => {
      console.log('✅ Simple Video Test - Can play');
    };

    const handlePlay = () => {
      console.log('▶️ Simple Video Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Simple Video Test - Paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Simple Video Test - Error:', e);
      setError('Video error occurred');
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    video.src = videoUrl;

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
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
        setError(err.message);
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="bold" color="yellow.400">
        Simple Video Test
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="yellow.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            maxWidth: '400px',
            height: 'auto',
            border: '2px solid red',
            backgroundColor: 'green'
          }}
          controls={true}
          preload="auto"
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
          
          {error && (
            <Text color="red.400" fontSize="sm">
              Error: {error}
            </Text>
          )}
          
          <Text fontSize="xs" color="gray.400">
            URL: {videoUrl}
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default SimpleVideoTest; 