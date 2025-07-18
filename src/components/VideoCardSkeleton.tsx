import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  SkeletonText,
  VStack,
  HStack,
} from "@chakra-ui/react";

const VideoCardSkeleton = () => {
  return (
    <Card maxW="sm">
      <Skeleton height="200px" />
      <CardBody>
        <VStack align="start" spacing={2}>
          <Skeleton height="20px" width="80%" />
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="3" />
          <HStack spacing={2}>
            <Skeleton height="20px" width="60px" />
            <Skeleton height="20px" width="80px" />
            <Skeleton height="20px" width="70px" />
          </HStack>
          <Skeleton height="16px" width="120px" />
        </VStack>
      </CardBody>
      <CardFooter pt={0}>
        <HStack spacing={4}>
          <Skeleton height="16px" width="40px" />
          <Skeleton height="16px" width="40px" />
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default VideoCardSkeleton;
