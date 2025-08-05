import React, { useState } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  VStack,
  Text,
  useToast,
  Spinner,
  Flex,
  useBreakpointValue,
  Card,
  CardBody,
  SimpleGrid,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FiEdit3, FiTrash2, FiFileText } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import useAdminPosts from "../hooks/useAdminPosts";
import { Post } from "../hooks/usePosts";
import { formatDistanceToNow } from "date-fns";

const BlogManagementPage: React.FC = () => {
  const toast = useToast();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values for better visibility
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    posts,
    pagination,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    isAdmin,
    isCreatingPost,
    isUpdatingPost,
    isDeletingPost,
  } = useAdminPosts();

  // Mobile card component
  const PostCard = ({ post }: { post: Post }) => (
    <Card shadow="sm" border="1px" borderColor={borderColor} bg={cardBg}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justify="space-between">
            <HStack spacing={3}>
              <FiFileText size={20} color="#3182CE" />
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold" fontSize="lg" color="blue.500">
                  {post.title}
                </Text>
                <Badge
                  colorScheme={post.status === "published" ? "green" : "yellow"}
                  variant="subtle"
                >
                  {post.status}
                </Badge>
              </VStack>
            </HStack>
          </HStack>

          {post.excerpt && (
            <Text fontSize="sm" color={secondaryTextColor} noOfLines={2}>
              {post.excerpt}
            </Text>
          )}

          <Text fontSize="sm" color={secondaryTextColor}>
            By {post.authorId.name} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </Text>

          <HStack spacing={2}>
            <Button
              as={RouterLink}
              to={`/admin/blog/edit/${post._id}`}
              colorScheme="teal"
              size="sm"
              leftIcon={<FiEdit3 />}
              flex={1}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              leftIcon={<FiTrash2 />}
              onClick={() => handleDeletePost(post._id)}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(postId);
        toast({
          title: "Post deleted successfully",
          status: "success",
          duration: 3000,
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete post",
          description: error.message,
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  if (!isAdmin()) {
    return (
      <Box p={4}>
        <Text>Access denied. Admin or Super Admin privileges required.</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Failed to load blog posts</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        bg={cardBg}
        shadow="sm"
        p={{ base: 4, md: 6 }}
        mb={4}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
      >
        <Flex
          direction={{ base: "column", sm: "row" }}
          justify="space-between"
          align={{ base: "stretch", sm: "center" }}
          gap={4}
        >
          <Heading color="blue.500" size="lg">
            Blog Management
          </Heading>
          <Button
            colorScheme="blue"
            as={RouterLink}
            to="/admin/blog/add"
            size={{ base: "md", md: "lg" }}
          >
            Add Post
          </Button>
        </Flex>
      </Box>

      {/* Content */}
      <Box bg={cardBg} shadow="sm" borderRadius="lg" overflow="hidden" border="1px" borderColor={borderColor}>
        {isMobile ? (
          // Mobile layout with cards
          <Box p={4}>
            <SimpleGrid columns={1} spacing={4}>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color={secondaryTextColor}>No posts found.</Text>
                </Box>
              )}
            </SimpleGrid>
          </Box>
        ) : (
          // Desktop/Tablet layout with table
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="blue.500">
                    <HStack spacing={2}>
                      <FiFileText />
                      <Text>Title</Text>
                    </HStack>
                  </Th>
                  <Th color="blue.500">Status</Th>
                  <Th color="blue.500">Author</Th>
                  <Th color="blue.500">Created</Th>
                  <Th color="blue.500">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <Tr key={post._id}>
                      <Td>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" color={textColor}>
                            {post.title}
                          </Text>
                          {post.excerpt && (
                            <Text fontSize="sm" color={secondaryTextColor} noOfLines={2}>
                              {post.excerpt}
                            </Text>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={post.status === "published" ? "green" : "yellow"}
                          variant="subtle"
                        >
                          {post.status}
                        </Badge>
                      </Td>
                      <Td color={textColor}>{post.authorId.name}</Td>
                      <Td color={secondaryTextColor}>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                        })}
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Button
                            as={RouterLink}
                            to={`/admin/blog/edit/${post._id}`}
                            colorScheme="teal"
                            size="sm"
                            leftIcon={<FiEdit3 />}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            leftIcon={<FiTrash2 />}
                            onClick={() => handleDeletePost(post._id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={8}>
                      <Text color={secondaryTextColor}>No posts found.</Text>
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default BlogManagementPage; 