import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Heading,
  useToast,
  Progress,
  Text,
  Badge,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { FaUpload, FaVideo, FaCheck, FaTimes } from "react-icons/fa";
import APIClient from "../services/api-client";
import { VIDEOS_ENDPOINT } from "../data/constants";

interface VideoUploadFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

interface UploadResponse {
  video: {
    _id: string;
    title: string;
    url: string;
  };
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "regular",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const supportedFormats = ['.mp4'];
  const maxFileSize = 500 * 1024 * 1024; // 500MB

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!selectedFile) {
      newErrors.file = "Please select a video file";
    } else {
      const fileExt = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf('.'));
      if (!supportedFormats.includes(fileExt)) {
        newErrors.file = `Only MP4 format is supported. Please convert your video to MP4 format.`;
      }
      if (selectedFile.size > maxFileSize) {
        newErrors.file = `File size too large. Maximum size: ${Math.round(maxFileSize / (1024 * 1024))}MB`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('video', selectedFile!);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('level', formData.level);

      const apiClient = new APIClient<UploadResponse>(VIDEOS_ENDPOINT);
      
      const response = await apiClient.postFormData(formDataToSend, (progressEvent) => {
        if (progressEvent.total) {
          setUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
          });
        }
      }) as UploadResponse;

      toast({
        title: "Video uploaded successfully",
        description: "Your MP4 video has been uploaded and is ready for playback",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.response?.data?.error || "An error occurred during upload",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleCancel = () => {
    setFormData({ title: "", description: "", level: "regular" });
    setSelectedFile(null);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onCancel?.();
  };

  const getFileIcon = (fileName: string) => {
    return <FaVideo color="#4CAF50" />;
  };

  const getFileBadgeColor = (fileName: string) => {
    return 'green';
  };

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500">Upload New Video</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            {/* File Upload */}
            <FormControl isRequired isInvalid={!!errors.file}>
              <FormLabel color="blue.500">Video File (MP4 only)</FormLabel>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".mp4"
                onChange={handleFileSelect}
                display="none"
              />
              <Button
                leftIcon={<FaUpload />}
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                w="100%"
                h="100px"
                borderStyle="dashed"
                borderWidth="2px"
                _hover={{ borderColor: "blue.500" }}
              >
                {selectedFile ? (
                  <VStack spacing={2}>
                    <HStack>
                      {getFileIcon(selectedFile.name)}
                      <Text fontWeight="bold">{selectedFile.name}</Text>
                    </HStack>
                    <Badge colorScheme={getFileBadgeColor(selectedFile.name)}>
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Badge>
                  </VStack>
                ) : (
                  <Text>Click to select MP4 video file</Text>
                )}
              </Button>
              <FormErrorMessage>{errors.file}</FormErrorMessage>
            </FormControl>

            {/* Form Fields */}
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel color="blue.500">Title</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter video title"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel color="blue.500">Description</FormLabel>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter video description"
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired>
              <FormLabel color="blue.500">Level</FormLabel>
              <Select
                value={formData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
              >
                <option value="regular">Regular</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>

            {/* Upload Progress */}
            {isUploading && (
              <Box w="100%">
                <Text mb={2}>Uploading video...</Text>
                <Progress 
                  value={uploadProgress?.percentage || 0} 
                  colorScheme="blue" 
                  size="lg"
                />
                {uploadProgress && (
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {Math.round(uploadProgress.loaded / (1024 * 1024))}MB / {Math.round(uploadProgress.total / (1024 * 1024))}MB
                  </Text>
                )}
              </Box>
            )}

            {/* Action Buttons */}
            <HStack spacing={4} w="100%">
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isUploading}
                loadingText="Uploading..."
                leftIcon={<FaUpload />}
                flex={1}
              >
                Upload Video
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                isDisabled={isUploading}
                leftIcon={<FaTimes />}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>

        {/* Supported Formats Info */}
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" mb={2}>
            Supported Video Format:
          </Text>
          <HStack spacing={2} wrap="wrap">
            <Badge colorScheme="green">
              .mp4
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.600" mt={2}>
            Maximum file size: 500MB. Only MP4 format is supported for optimal browser compatibility.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default VideoUploadForm; 