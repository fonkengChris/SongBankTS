import React, { useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  Badge,
  HStack,
  VStack,
  Input,
  Select,
  Button,
  Spinner,
  Image,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import usePosts from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

const BlogPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const {
    posts,
    pagination,
    isLoading,
    error,
  } = usePosts(page, 9, selectedTag, search);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={20}>
        <Text color="red.500">Failed to load blog posts</Text>
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            Blog
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Music tips, tutorials, and updates from our community
          </Text>
        </Box>

        {/* Search and Filter */}
        <Box>
          <HStack spacing={4} mb={4}>
            <Input
              placeholder="Search posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button
              leftIcon={<SearchIcon />}
              onClick={handleSearch}
              colorScheme="blue"
            >
              Search
            </Button>
          </HStack>

          {/* Tag Filter */}
          <HStack spacing={2} flexWrap="wrap">
            <Button
              size="sm"
              variant={selectedTag === "" ? "solid" : "outline"}
              onClick={() => handleTagFilter("")}
            >
              All
            </Button>
            {/* Add more tag buttons as needed */}
          </HStack>
        </Box>

        {/* Posts Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {posts.map((post) => (
            <Box
              key={post._id}
              borderWidth={1}
              borderRadius="lg"
              overflow="hidden"
              _hover={{ shadow: "lg" }}
              transition="all 0.2s"
            >
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
              )}

              <Box p={6}>
                <VStack align="start" spacing={3}>
                  <HStack spacing={2}>
                    {post.tags.map((tag) => (
                      <Badge key={tag} colorScheme="blue" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>

                  <Heading size="md" noOfLines={2}>
                    <ChakraLink
                      as={Link}
                      to={`/blog/${post.slug}`}
                      _hover={{ textDecoration: "none" }}
                    >
                      {post.title}
                    </ChakraLink>
                  </Heading>

                  {post.excerpt && (
                    <Text color="gray.600" noOfLines={3}>
                      {post.excerpt}
                    </Text>
                  )}

                  <HStack justify="space-between" w="100%">
                    <Text fontSize="sm" color="gray.500">
                      By {post.authorId.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </HStack>

                  <Button
                    as={Link}
                    to={`/blog/${post.slug}`}
                    colorScheme="blue"
                    size="sm"
                    w="100%"
                  >
                    Read More
                  </Button>
                </VStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Box textAlign="center" py={8}>
            <HStack justify="center" spacing={2}>
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={!pagination.hasPrev}
                variant="outline"
              >
                Previous
              </Button>

              <Text>
                Page {pagination.currentPage} of {pagination.totalPages}
              </Text>

              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={!pagination.hasNext}
                variant="outline"
              >
                Next
              </Button>
            </HStack>
          </Box>
        )}

        {posts.length === 0 && (
          <Box textAlign="center" py={20}>
            <Text fontSize="lg" color="gray.500">
              No posts found.
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default BlogPage; 