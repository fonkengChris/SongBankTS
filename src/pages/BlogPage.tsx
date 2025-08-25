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
import PostLike from "../components/PostLike";

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
              borderColor="gray.200"
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              _hover={{ 
                shadow: "xl",
                transform: "translateY(-4px)",
                borderColor: "blue.200"
              }}
              transition="all 0.3s ease"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              {/* Featured Image Section */}
              <Box position="relative" height="200px" overflow="hidden">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                    transition="transform 0.3s ease"
                    _hover={{ transform: "scale(1.05)" }}
                  />
                ) : (
                  <Box
                    height="100%"
                    width="100%"
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="gray.400"
                  >
                    <Text fontSize="sm">No Image</Text>
                  </Box>
                )}
                {/* Tags overlay on image */}
                <Box
                  position="absolute"
                  top={3}
                  left={3}
                  zIndex={1}
                >
                  <HStack spacing={2}>
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge 
                        key={tag} 
                        colorScheme="blue" 
                        size="sm"
                        variant="solid"
                        opacity="0.9"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge 
                        colorScheme="gray" 
                        size="sm"
                        variant="solid"
                        opacity="0.9"
                      >
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </HStack>
                </Box>
              </Box>

              {/* Content Section */}
              <Box p={6} flex="1" display="flex" flexDirection="column">
                <VStack align="start" spacing={4} flex="1">
                  <Heading 
                    size="md" 
                    noOfLines={2}
                    lineHeight="1.3"
                    fontWeight="700"
                    color="gray.800"
                  >
                    <ChakraLink
                      as={Link}
                      to={`/blog/${post.slug}`}
                      _hover={{ textDecoration: "none", color: "blue.600" }}
                      transition="color 0.2s ease"
                    >
                      {post.title}
                    </ChakraLink>
                  </Heading>

                  {post.excerpt && (
                    <Text 
                      color="gray.600" 
                      noOfLines={3}
                      lineHeight="1.6"
                      fontSize="sm"
                    >
                      {post.excerpt}
                    </Text>
                  )}

                  {/* Author and Date */}
                  <HStack justify="space-between" w="100%" pt={2}>
                    <Text fontSize="sm" color="gray.500" fontWeight="500">
                      By {post.authorId.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                        addSuffix: true,
                      })}
                    </Text>
                  </HStack>

                  {/* Likes and Read More */}
                  <HStack justify="space-between" w="100%" pt={2}>
                    <PostLike
                      postId={post._id}
                      isLiked={post.isLiked || false}
                      likesCount={post.likesCount || 0}
                    />
                    <Button
                      as={Link}
                      to={`/blog/${post.slug}`}
                      colorScheme="blue"
                      size="sm"
                      variant="outline"
                      _hover={{ 
                        bg: "blue.500", 
                        color: "white",
                        transform: "translateX(2px)"
                      }}
                      transition="all 0.2s ease"
                    >
                      Read More
                    </Button>
                  </HStack>
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