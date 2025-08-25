import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Avatar,
  Divider,
  Image,
  Link as ChakraLink,
  Spinner,
} from "@chakra-ui/react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import usePost from "../hooks/usePost";
import { formatDistanceToNow } from "date-fns";
import PostLike from "../components/PostLike";

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" />;
  }

  const { post, isLoading, error } = usePost(slug);

  if (isLoading) {
    return (
      <Box textAlign="center" py={20}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error || !post) {
    return (
      <Container maxW="container.md" py={8}>
        <Box textAlign="center">
          <Text color="red.500" fontSize="lg">
            Post not found
          </Text>
          <ChakraLink as={Link} to="/blog" color="blue.500">
            Back to Blog
          </ChakraLink>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Back Button */}
        <Box>
          <ChakraLink
            as={Link}
            to="/blog"
            display="inline-flex"
            alignItems="center"
            color="blue.500"
            _hover={{ textDecoration: "none" }}
          >
            <ArrowBackIcon mr={2} />
            Back to Blog
          </ChakraLink>
        </Box>

        {/* Featured Image */}
        {post.featuredImage && (
          <Box
            borderRadius="xl"
            overflow="hidden"
            boxShadow="lg"
            position="relative"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              borderRadius="xl"
              w="100%"
              maxH="500px"
              objectFit="cover"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.02)" }}
            />
            {/* Tags overlay on image */}
            <Box
              position="absolute"
              top={4}
              left={4}
              zIndex={1}
            >
              <HStack spacing={2} flexWrap="wrap">
                {post.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    colorScheme="blue" 
                    size="md"
                    variant="solid"
                    opacity="0.9"
                    px={3}
                    py={1}
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>
            </Box>
          </Box>
        )}

        {/* Post Header */}
        <Box>
          <VStack align="start" spacing={4}>
            <HStack spacing={2} flexWrap="wrap">
              {post.tags.map((tag) => (
                <Badge key={tag} colorScheme="blue" size="sm">
                  {tag}
                </Badge>
              ))}
            </HStack>

            <Heading size="xl">{post.title}</Heading>

            {post.excerpt && (
              <Text fontSize="lg" color="gray.600" fontStyle="italic">
                {post.excerpt}
              </Text>
            )}

            <HStack spacing={4}>
              <HStack>
                <Avatar
                  size="sm"
                  name={post.authorId.name}
                  src={post.authorId.picture}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold" fontSize="sm">
                    {post.authorId.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {formatDistanceToNow(new Date(post.publishedAt || post.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </VStack>
              </HStack>
              <PostLike
                postId={post._id}
                isLiked={post.isLiked || false}
                likesCount={post.likesCount || 0}
              />
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Post Content */}
        <Box>
          <Text
            fontSize="lg"
            lineHeight="1.8"
            whiteSpace="pre-wrap"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Box>

        {/* Post Footer */}
        <Box pt={8}>
          <Divider mb={4} />
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500">
              Last updated: {formatDistanceToNow(new Date(post.updatedAt), {
                addSuffix: true,
              })}
            </Text>
            <ChakraLink as={Link} to="/blog" color="blue.500">
              ← Back to Blog
            </ChakraLink>
          </HStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default BlogPostPage; 