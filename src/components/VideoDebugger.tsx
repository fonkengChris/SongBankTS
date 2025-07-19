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
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaPlay, FaDownload, FaExternalLinkAlt, FaInfo } from "react-icons/fa";

interface VideoDebuggerProps {
  videoUrl: string;
  title: string;
}

const VideoDebugger: React.FC<VideoDebuggerProps> = ({ videoUrl, title }) => {
  const [testResult, setTestResult] = useState<string>("");
  const [isTesting, setIsTesting] = useState(false);
  const [detailedInfo, setDetailedInfo] = useState<any>(null);

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

        {detailedInfo && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>Detailed Response Info:</Text>
            <Code fontSize="xs" p={2} bg="gray.100" borderRadius="md" display="block" whiteSpace="pre-wrap">
              {JSON.stringify(detailedInfo, null, 2)}
            </Code>
          </Box>
        )}

        <Divider />

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