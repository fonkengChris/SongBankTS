import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaPlay, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

interface VideoDebuggerProps {
  videoUrl: string;
  title: string;
}

const VideoDebugger: React.FC<VideoDebuggerProps> = ({ videoUrl, title }) => {
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);

  const testVideoUrl = async () => {
    setIsTesting(true);
    setTestResult("");

    try {
      // Test 1: Check if URL is accessible
      const response = await fetch(videoUrl, { method: 'HEAD' });
      
      if (response.ok) {
        setTestResult(`✅ URL accessible - Status: ${response.status}`);
      } else {
        setTestResult(`❌ URL not accessible - Status: ${response.status}`);
      }
    } catch (error: any) {
      setTestResult(`❌ Error testing URL: ${error.message}`);
    } finally {
      setIsTesting(false);
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

  return (
    <Box border="1px" borderColor="gray.300" borderRadius="lg" p={4} bg="gray.50">
      <VStack spacing={4} align="stretch">
        <Text fontSize="lg" fontWeight="bold">
          Video Debugger
        </Text>

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
              <AlertTitle>Test Result</AlertTitle>
              <AlertDescription>{testResult}</AlertDescription>
            </Box>
          </Alert>
        )}

        <VStack align="start" spacing={2}>
          <Text fontSize="sm" fontWeight="semibold">Troubleshooting Tips:</Text>
          <Text fontSize="xs" color="gray.600">
            • If URL test fails, check if the video file exists in S3
          </Text>
          <Text fontSize="xs" color="gray.600">
            • If video doesn't play, check browser console for CSP errors
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Try downloading the video to test if it's accessible
          </Text>
          <Text fontSize="xs" color="gray.600">
            • Check if S3 bucket CORS settings allow your domain
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default VideoDebugger; 