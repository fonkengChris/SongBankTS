import { Icon, Text, HStack } from "@chakra-ui/react";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import usePostLike from "../hooks/usePostLike";
import { useState } from "react";

interface Props {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  onLikeChange?: (isLiked: boolean, newCount: number) => void;
}

const PostLike = ({ postId, isLiked: initialIsLiked, likesCount: initialLikesCount, onLikeChange }: Props) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  
  const { likePost, unlikePost } = usePostLike();

  const handleLikeClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      if (isLiked) {
        const result = await unlikePost(postId);
        if (result.success) {
          setIsLiked(false);
          setLikesCount(prev => Math.max(0, prev - 1));
          onLikeChange?.(false, likesCount - 1);
        }
      } else {
        const result = await likePost(postId);
        if (result.success) {
          setIsLiked(true);
          setLikesCount(prev => prev + 1);
          onLikeChange?.(true, likesCount + 1);
        }
      }
    } catch (error) {
      console.error("Error toggling post like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HStack spacing={1} cursor="pointer" onClick={handleLikeClick}>
      <Icon
        as={isLiked ? BsHeartFill : BsHeart}
        color={isLiked ? "red.500" : "gray.400"}
        transition="all 0.2s ease-in-out"
        _hover={{ transform: "scale(1.1)" }}
        opacity={isLoading ? 0.5 : 1}
      />
      {likesCount > 0 && (
        <Text fontSize="sm" color="gray.600">
          {likesCount}
        </Text>
      )}
    </HStack>
  );
};

export default PostLike; 