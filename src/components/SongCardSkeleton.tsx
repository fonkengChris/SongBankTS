import { Card, CardBody, Skeleton, SkeletonText, Box } from "@chakra-ui/react";
import React from "react";
import SongCardContainer from "./SongCardContainer";

const SongCardSkeleton = () => {
  return (
    <Card height="100%" display="flex" flexDirection="column">
      <Skeleton
        height={{ base: "200px", sm: "220px", md: "240px", lg: "260px" }}
        width="100%"
      />
      <CardBody
        flex={1}
        display="flex"
        flexDirection="column"
        p={{ base: 3, md: 4 }}
      >
        <Box flex={1}>
          <Skeleton height="20px" mb={2} />
          <Skeleton height="16px" mb={2} />
          <Skeleton height="16px" mb={2} />
        </Box>
        <Box mt={3} pt={2} borderTop="1px solid" borderColor="gray.100">
          <Skeleton height="16px" />
        </Box>
      </CardBody>
    </Card>
  );
};

export default SongCardSkeleton;
