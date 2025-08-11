import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  useToast,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  Select,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../services/api-client";
import { Post } from "../hooks/usePosts";

interface BlogPostFormData {
  title: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  tags: string[];
  featuredImage?: string;
}

const BlogPostFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { logout, auth, isAuthenticated } = useAuth();

  // Check authentication and authorization
  if (!isAuthenticated) {
    return (
      <Box p={4} textAlign="center">
        <Text>Please log in to access this page.</Text>
        <Button mt={4} colorScheme="blue" onClick={() => navigate("/auth")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  let user: any = null;
  try {
    if (auth.access) {
      user = JSON.parse(atob(auth.access.split('.')[1]));
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  if (!user) {
    return (
      <Box p={4} textAlign="center">
        <Text>Please log in to access this page.</Text>
        <Button mt={4} colorScheme="blue" onClick={() => navigate("/auth")}>
          Go to Login
        </Button>
      </Box>
    );
  }

  if (user.role !== "admin" && user.role !== "superAdmin") {
    return (
      <Box p={4} textAlign="center">
        <Text>Access denied. Admin privileges required.</Text>
        <Button mt={4} colorScheme="blue" onClick={() => navigate("/admin")}>
          Go to Admin Dashboard
        </Button>
      </Box>
    );
  }

  // Color mode values for consistent styling
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const inputBg = useColorModeValue("white", "gray.700");
  const inputColor = useColorModeValue("gray.800", "gray.100");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");

  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    tags: [],
    featuredImage: "",
  });

  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axiosInstance
        .get(`/api/posts/${id}`)
        .then((response) => {
          const post = response.data;
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || "",
            status: post.status,
            tags: post.tags || [],
            featuredImage: post.featuredImage || "",
          });
        })
        .catch((error) => {
          let errorMessage = "An error occurred while fetching the post";
          
          if (error.response?.status === 401) {
            errorMessage = "Authentication failed. Please log in again.";
            logout();
          } else if (error.response?.status === 403) {
            errorMessage = "Access denied. Admin privileges required.";
          } else if (error.response?.status === 404) {
            errorMessage = "Post not found";
          } else if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.message) {
            errorMessage = error.message;
          }

          toast({
            title: "Error fetching post",
            description: errorMessage,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(atob(auth.access!.split('.')[1]));

      // Check if user has admin privileges
      if (user.role !== "admin" && user.role !== "superAdmin") {
        toast({
          title: "Access Denied",
          description: "Admin privileges required to manage blog posts",
          status: "error",
        });
        navigate("/admin");
        return;
      }

      // Filter out empty fields to avoid validation errors
      const postData = {
        title: formData.title,
        content: formData.content,
        status: formData.status,
        tags: formData.tags,
        ...(formData.excerpt && { excerpt: formData.excerpt }),
        ...(formData.featuredImage && { featuredImage: formData.featuredImage }),
      };

      if (id) {
        await axiosInstance.put(`/api/posts/${id}`, postData);
        toast({
          title: "Post updated successfully",
          status: "success",
        });
      } else {
        await axiosInstance.post("/api/posts", postData);
        toast({
          title: "Post created successfully",
          status: "success",
        });
      }
      navigate("/admin/blog");
    } catch (error: any) {
      let errorMessage = "An error occurred while saving the post";
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please log in again.";
        logout();
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied. Admin privileges required.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.error || "Invalid data provided";
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error saving post",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Box maxW="container.lg" mx="auto" py={8} px={6}>
      <VStack spacing={8} align="stretch">
        <Heading color="blue.500" fontWeight="bold" textAlign="center">
          {id ? "Edit Blog Post" : "Create New Blog Post"}
        </Heading>
        
        <Card 
          bg={bgColor} 
          shadow="md" 
          border="1px solid" 
          borderColor={borderColor}
          borderRadius="lg"
        >
          <CardBody p={8}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Title</FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter post title"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Excerpt</FormLabel>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Enter a brief excerpt for the post"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                    rows={3}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Content</FormLabel>
                  <Textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Write your blog post content here..."
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                    rows={12}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Featured Image URL</FormLabel>
                  <Input
                    value={formData.featuredImage}
                    onChange={(e) =>
                      setFormData({ ...formData, featuredImage: e.target.value })
                    }
                    placeholder="Enter image URL (optional)"
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as "draft" | "published" })
                    }
                    bg={inputBg}
                    color={inputColor}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputFocusBorderColor }}
                    _focus={{ 
                      borderColor: inputFocusBorderColor, 
                      boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                    }}
                    transition="all 0.2s"
                    size="lg"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel color="blue.500" fontWeight="semibold" mb={2}>Tags</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag and press Enter"
                      bg={inputBg}
                      color={inputColor}
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: inputFocusBorderColor }}
                      _focus={{ 
                        borderColor: inputFocusBorderColor, 
                        boxShadow: `0 0 0 1px ${inputFocusBorderColor}` 
                      }}
                      transition="all 0.2s"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        Add
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  
                  {formData.tags.length > 0 && (
                    <HStack mt={2} spacing={2} flexWrap="wrap">
                      {formData.tags.map((tag) => (
                        <Tag key={tag} size="md" colorScheme="blue" borderRadius="full">
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                        </Tag>
                      ))}
                    </HStack>
                  )}
                </FormControl>

                <Flex gap={4} pt={4}>
                  <Button
                    onClick={() => navigate("/admin/blog")}
                    colorScheme="red"
                    flex={1}
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    colorScheme="blue" 
                    flex={1} 
                    minW="140px"
                    size="lg"
                    _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
                    transition="all 0.2s"
                    isLoading={isLoading}
                    loadingText={id ? "Updating..." : "Creating..."}
                  >
                    {id ? "Update Post" : "Create Post"}
                  </Button>
                </Flex>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default BlogPostFormPage; 