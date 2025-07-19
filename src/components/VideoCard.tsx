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
} from "@chakra-ui/react";
import { FaPlay, FaClock, FaVideo } from "react-icons/fa";
import Video from "../entities/Video";
import { useState } from "react";

interface Props {
  video: Video;
  onClick?: () => void;
}

const VideoCard = ({ video, onClick }: Props) => {
  const [imageError, setImageError] = useState(false);

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
            bg="gray.700"
            color="gray.400"
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
          </HStack>

          {video.createdAt && (
          <Text fontSize="sm" color="gray.400">
              Created: {new Date(video.createdAt).toLocaleDateString()}
          </Text>
          )}
        </VStack>
      </CardBody>

      <CardFooter pt={0}>
        <HStack spacing={4} color="gray.500" fontSize="sm">
          {video.duration && (
          <Flex align="center" gap={1}>
              <Icon as={FaClock} boxSize={3} />
              <Text>{formatDuration(video.duration)}</Text>
          </Flex>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
