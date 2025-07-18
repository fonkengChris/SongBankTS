import { SimpleGrid, Spinner, Text, Box } from "@chakra-ui/react";
import VideoCard from "./VideoCard";
import Video from "../entities/Video";
import VideoCardSkeleton from "./VideoCardSkeleton";

interface Props {
  videos: Video[];
  isLoading?: boolean;
  error?: string;
  onVideoClick?: (video: Video) => void;
}

const VideoGrid = ({ videos, isLoading, error, onVideoClick }: Props) => {
  if (error) return <Text>{error}</Text>;

  if (isLoading) {
    const skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
    return (
      <SimpleGrid
        columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
        spacing={6}
        padding="10px"
      >
        {skeletons.map((skeleton) => (
          <VideoCardSkeleton key={skeleton} />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      spacing={6}
      padding="10px"
    >
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          video={video}
          onClick={() => onVideoClick?.(video)}
        />
      ))}
    </SimpleGrid>
  );
};

export default VideoGrid;
