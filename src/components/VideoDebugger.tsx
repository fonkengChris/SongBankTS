import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Badge,
  Divider,
  Icon,
  AspectRatio,
} from "@chakra-ui/react";
import { FaPlay, FaDownload, FaExternalLinkAlt, FaInfo, FaVideo } from "react-icons/fa";

interface VideoDebuggerProps {
  videoUrl: string;
  title: string;
}

const VideoDebugger: React.FC<VideoDebuggerProps> = ({ videoUrl, title }) => {
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);
  const [detailedInfo, setDetailedInfo] = useState<any>(null);
  const [videoTestResult, setVideoTestResult] = useState<string>("");
  const [isVideoTesting, setIsVideoTesting] = useState(false);
  const [showTestVideo, setShowTestVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const testVideoUrl = async () => {
    setIsTesting(true);
    setTestResult("");
    setDetailedInfo(null);

    try {
      // Test 1: Check if URL is accessible
      const response = await fetch(videoUrl, { method: 'HEAD' });
      
      const info = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        type: response.type,
        ok: response.ok
      };
      
      setDetailedInfo(info);
      
      if (response.ok) {
        setTestResult(`✅ URL accessible - Status: ${response.status}`);
      } else {
        setTestResult(`❌ URL not accessible - Status: ${response.status}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error testing URL: ${error.message}`);
      setDetailedInfo({ error: error.message, stack: error.stack });
    } finally {
      setIsTesting(false);
    }
  };

  const testVideoPlayback = async () => {
    setIsVideoTesting(true);
    setVideoTestResult("");

    const video = videoRef.current;
    if (!video) {
      setVideoTestResult("❌ Video element not found");
      setIsVideoTesting(false);
      return;
    }

    try {
      // Set video source
      video.src = videoUrl;
      video.load();

      // Wait for video to load
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Video loading timeout"));
        }, 10000);

        const handleLoadedMetadata = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        const handleError = () => {
          clearTimeout(timeout);
          reject(new Error("Video failed to load"));
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
        video.addEventListener('error', handleError, { once: true });
      });

      setVideoTestResult(`✅ Video loaded successfully - Duration: ${video.duration.toFixed(2)}s`);
    } catch (error: any) {
      setVideoTestResult(`❌ Video test failed: ${error.message}`);
    } finally {
      setIsVideoTesting(false);
    }
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

  const isMP4 = videoUrl.toLowerCase().endsWith('.mp4');
  const isS3 = videoUrl.includes('s3.amazonaws.com');
  const isEuWest2 = videoUrl.includes('eu-west-2');

  return (
    <Box border="1px" borderColor="gray.300" borderRadius="lg" p={4} bg="gray.50">
      <VStack spacing={4} align="stretch">
        <HStack>
          <Icon as={FaInfo} color="blue.500" />
          <Text fontSize="lg" fontWeight="bold">
            Video Debugger
          </Text>
        </HStack>

        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="semibold">Video URL:</Text>
          <Code fontSize="xs" p={2} bg="gray.100" borderRadius="md" wordBreak="break-all">
            {videoUrl}
          </Code>
        </VStack>

        <HStack spacing={2} wrap="wrap">
          <Badge colorScheme={isMP4 ? "green" : "red"}>
            {isMP4 ? "MP4 Format" : "Non-MP4 Format"}
          </Badge>
          <Badge colorScheme={isS3 ? "blue" : "gray"}>
            {isS3 ? "S3 URL" : "Non-S3 URL"}
          </Badge>
          {isS3 && (
            <Badge colorScheme={isEuWest2 ? "purple" : "orange"}>
              {isEuWest2 ? "eu-west-2 Region" : "Other Region"}
            </Badge>
          )}
        </HStack>

        <HStack spacing={4}>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={testVideoUrl}
            isLoading={isTesting}
            loadingText="Testing..."
            leftIcon={<FaPlay />}
          >
            Test URL
          </Button>
          
          <Button
            size="sm"
            colorScheme="green"
            onClick={testVideoPlayback}
            isLoading={isVideoTesting}
            loadingText="Testing..."
            leftIcon={<FaVideo />}
          >
            Test Video
          </Button>
          
          <Button
            size="sm"
            colorScheme="purple"
            onClick={() => setShowTestVideo(!showTestVideo)}
            leftIcon={<FaVideo />}
          >
            {showTestVideo ? 'Hide' : 'Show'} Test Video
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            leftIcon={<FaDownload />}
          >
            Download
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpenInNewTab}
            leftIcon={<FaExternalLinkAlt />}
          >
            Open in Tab
          </Button>
        </HStack>

        {testResult && (
          <Alert status={testResult.includes("✅") ? "success" : "error"} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>URL Test Result</AlertTitle>
              <AlertDescription>{testResult}</AlertDescription>
            </Box>
          </Alert>
        )}

        {videoTestResult && (
          <Alert status={videoTestResult.includes("✅") ? "success" : "error"} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Video Test Result</AlertTitle>
              <AlertDescription>{videoTestResult}</AlertDescription>
            </Box>
          </Alert>
        )}

        {detailedInfo && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Detailed Response Info:</Text>
            <Code fontSize="xs" p={2} bg="gray.100" borderRadius="md" display="block" whiteSpace="pre-wrap">
              {JSON.stringify(detailedInfo, null, 2)}
            </Code>
          </Box>
        )}

        {/* Test video player */}
        {showTestVideo && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Test Video Player:</Text>
            <AspectRatio ratio={16 / 9}>
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                style={{ width: '100%', height: '100%' }}
                crossOrigin="anonymous"
              >
                Your browser does not support the video tag.
              </video>
            </AspectRatio>
          </Box>
        )}

        <Divider />

        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="semibold">Troubleshooting Tips:</Text>
          <Text fontSize="xs" color="gray.600">
            • If URL test fails, check if the video file exists in S3
          </Text>
          <Text fontSize="xs" color="gray.600">
            • If video test fails, the file might be corrupted or not a valid MP4
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Try the test video player to see if the video loads with native controls
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Try downloading the video to test if it's accessible
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Check if S3 bucket CORS settings allow your domain
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Verify the S3 bucket is publicly accessible
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Check if the file path in the URL is correct
          </Text>
        </VStack>

        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="semibold">CSP Status:</Text>
          <Text fontSize="xs" color="gray.600">
            • Media sources should include: https://*.s3.eu-west-2.amazonaws.com
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Connect sources should include: https://*.s3.eu-west-2.amazonaws.com
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Image sources should include: https://*.s3.eu-west-2.amazonaws.com
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default VideoDebugger; 