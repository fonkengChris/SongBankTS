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
} from "@chakra-ui/react";
import { FaPlay, FaEye, FaHeart, FaClock } from "react-icons/fa";
import Video from "../entities/Video";

interface Props {
  video: Video;
  onClick?: () => void;
}

const VideoCard = ({ video, onClick }: Props) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "green";
      case "intermediate":
        return "yellow";
      case "advanced":
        return "orange";
      case "expert":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Card
      maxW="sm"
      cursor="pointer"
      onClick={onClick}
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "lg",
      }}
    >
      <Box position="relative">
        <Image
          src={video.thumbnailUrl || "/no-image-placeholder.jpg"}
          alt={video.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="blackAlpha.600"
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
      </Box>

      <CardBody>
        <VStack align="start" spacing={2}>
          <Heading size="md" noOfLines={2}>
            {video.title}
          </Heading>

          <Text fontSize="sm" color="gray.500" noOfLines={2}>
            {video.description}
          </Text>

          <HStack spacing={2} wrap="wrap">
            <Badge colorScheme={getLevelColor(video.level)}>
              {video.level.charAt(0).toUpperCase() + video.level.slice(1)}
            </Badge>
            {video.category && (
              <Badge colorScheme="blue" variant="outline">
                {video.category.title}
              </Badge>
            )}
            {video.language && (
              <Badge colorScheme="purple" variant="outline">
                {video.language.name}
              </Badge>
            )}
          </HStack>

          <Text fontSize="sm" color="gray.400">
            By {video.instructor}
          </Text>
        </VStack>
      </CardBody>

      <CardFooter pt={0}>
        <HStack spacing={4} color="gray.500" fontSize="sm">
          <Flex align="center" gap={1}>
            <Icon as={FaEye} boxSize={3} />
            <Text>{video.views || 0}</Text>
          </Flex>
          <Flex align="center" gap={1}>
            <Icon as={FaHeart} boxSize={3} />
            <Text>{video.likesCount || 0}</Text>
          </Flex>
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
