import React, { useRef, useEffect, useState } from "react";
import { Box, Text, Button, VStack, HStack, Badge } from "@chakra-ui/react";

interface VideoFormatTestProps {
  videoUrl: string;
}

const VideoFormatTest: React.FC<VideoFormatTestProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<any>({});

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎬 Video Format Test - Starting...');

    const handleLoadedMetadata = () => {
      console.log('✅ Video Format Test - Metadata loaded');
      setVideoInfo({
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        networkState: video.networkState,
        currentSrc: video.currentSrc,
        src: video.src
      });
    };

    const handleCanPlay = () => {
      console.log('✅ Video Format Test - Can play');
    };

    const handlePlay = () => {
      console.log('▶️ Video Format Test - Playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('⏸️ Video Format Test - Paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video Format Test - Error:', e);
      console.error('❌ Video error details:', video.error);
      setError('Video error occurred');
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Set video source
    video.src = videoUrl;
    video.load();

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
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
      <Text fontSize="lg" fontWeight="bold" color="purple.400">
        Video Format Test
      </Text>
      
      <Box 
        border="3px solid" 
        borderColor="purple.400" 
        borderRadius="lg" 
        p={4}
        bg="gray.900"
      >
        <video
          ref={videoRef}
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            border: '2px solid orange',
            backgroundColor: 'blue'
          }}
          controls={true}
          preload="metadata"
          muted={true}
          playsInline={true}
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

          {/* Video Info */}
          <Box fontSize="xs" color="gray.300" bg="gray.800" p={2} borderRadius="md" w="100%">
            <Text fontWeight="bold" mb={1}>Video Info:</Text>
            <HStack spacing={2} wrap="wrap">
              <Badge colorScheme="blue">Duration: {videoInfo.duration?.toFixed(2) || 'N/A'}s</Badge>
              <Badge colorScheme="green">Size: {videoInfo.videoWidth || 'N/A'}x{videoInfo.videoHeight || 'N/A'}</Badge>
              <Badge colorScheme="purple">Ready: {videoInfo.readyState || 'N/A'}</Badge>
              <Badge colorScheme="orange">Network: {videoInfo.networkState || 'N/A'}</Badge>
            </HStack>
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
};

export default VideoFormatTest; 