import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
  Badge,
  HStack,
  VStack,
  Icon,
  Flex,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaYoutube, FaClock, FaVideo, FaPlay } from "react-icons/fa";
import Video from "../entities/Video";
import { useState } from "react";

interface Props {
  video: Video;
  onClick?: () => void;
}

const VideoCard = ({ video, onClick }: Props) => {
  const [imageError, setImageError] = useState(false);

  // Theme-aware colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardHoverShadow = useColorModeValue("0 10px 25px rgba(0, 0, 0, 0.1)", "0 10px 25px rgba(0, 0, 0, 0.3)");
  const thumbnailBg = useColorModeValue("gray.200", "gray.700");
  const thumbnailTextColor = useColorModeValue("gray.600", "gray.400");
  const titleColor = useColorModeValue("gray.800", "white");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "regular":
        return "green";
      case "admin":
        return "red";
      default:
        return "gray";
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <Card
      maxW="sm"
      cursor="pointer"
      onClick={onClick}
      bg={cardBg}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: cardHoverShadow,
      }}
    >
      <Box position="relative">
        {video.thumbnailUrl && !imageError ? (
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            height="200px"
            width="100%"
            objectFit="cover"
            onError={handleImageError}
          />
        ) : (
          <Center
            height="200px"
            width="100%"
            bg={thumbnailBg}
            color={thumbnailTextColor}
            flexDirection="column"
            gap={2}
          >
            <Icon as={FaVideo} boxSize={8} />
            <Text fontSize="sm">No Thumbnail</Text>
          </Center>
        )}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="red.600"
          borderRadius="full"
          p={3}
        >
          <Icon as={FaPlay} color="white" boxSize={6} />
        </Box>
        {video.duration && (
          <Badge
            position="absolute"
            bottom={2}
            right={2}
            colorScheme="blackAlpha"
            borderRadius="md"
            px={2}
            py={1}
          >
            <HStack spacing={1}>
              <Icon as={FaClock} boxSize={3} />
              <Text fontSize="xs">{formatDuration(video.duration)}</Text>
            </HStack>
          </Badge>
        )}
        {isYouTubeUrl(video.url) && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="red"
            borderRadius="md"
            px={2}
            py={1}
          >
            <HStack spacing={1}>
              <Icon as={FaYoutube} boxSize={3} />
              <Text fontSize="xs">YouTube</Text>
            </HStack>
          </Badge>
        )}
      </Box>

      <CardBody>
        <VStack align="start" spacing={2}>
          <Heading size="md" noOfLines={2} color={titleColor}>
            {video.title}
          </Heading>

          <Text fontSize="sm" color={subtextColor} noOfLines={2}>
            {video.description}
          </Text>

          <HStack spacing={2} wrap="wrap">
            <Badge colorScheme={getLevelColor(video.level)}>
              {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
            </Badge>
            {isYouTubeUrl(video.url) && (
              <Badge colorScheme="red" variant="outline">
                <HStack spacing={1}>
                  <Icon as={FaYoutube} boxSize={3} />
                  <Text>YouTube Tutorial</Text>
                </HStack>
              </Badge>
            )}
          </HStack>

          {video.createdAt && (
          <Text fontSize="sm" color={subtextColor}>
              Created: {new Date(video.createdAt).toLocaleDateString()}
          </Text>
          )}
        </VStack>
      </CardBody>

      <CardFooter pt={0}>
        <HStack spacing={4} color={subtextColor} fontSize="sm">
          {video.duration && (
          <Flex align="center" gap={1}>
              <Icon as={FaClock} boxSize={3} />
              <Text>{formatDuration(video.duration)}</Text>
          </Flex>
          )}
          {isYouTubeUrl(video.url) && (
            <Flex align="center" gap={1} color="red.500">
              <Icon as={FaYoutube} boxSize={3} />
              <Text>Click to watch tutorial</Text>
            </Flex>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
