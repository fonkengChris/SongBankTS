import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  Avatar,
  Divider,
  IconButton,
  useToast,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { FiMessageSquare } from "react-icons/fi";
import useComments, { Comment } from "../hooks/useComments";
import { formatDistanceToNow } from "date-fns";
import { parseCommentText } from "../utils/mention-utils";

interface CommentSectionProps {
  songId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ songId }) => {
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [replyText, setReplyText] = useState("");
  const toast = useToast();

  const {
    comments,
    pagination,
    isLoading,
    error,
    addComment,
    updateComment,
    deleteComment,
    canEditComment,
    canDeleteComment,
    isAddingComment,
    isUpdatingComment,
    isDeletingComment,
  } = useComments(songId);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { mentionUsernames } = parseCommentText(newComment.trim());
      // For now, we'll use empty mentions array - in a real app you'd resolve usernames to IDs
      await addComment(newComment.trim(), undefined, []);
      setNewComment("");
      toast({
        title: "Comment added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const { mentionUsernames } = parseCommentText(editText.trim());
      await updateComment(commentId, editText.trim(), []);
      setEditingComment(null);
      setEditText("");
      toast({
        title: "Comment updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to update comment",
        description: error.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast({
        title: "Comment deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete comment",
        description: error.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment._id);
    setEditText(comment.comment);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText("");
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    setReplyText(`@${comment.userId.name} `);
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyingTo) return;

    try {
      const { mentionUsernames } = parseCommentText(replyText.trim());
      await addComment(replyText.trim(), replyingTo._id, []);
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Reply added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Failed to add reply",
        description: error.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText("");
  };

  // Render a single comment with replies
  const renderComment = (comment: Comment, isReply = false) => (
    <Box 
      key={comment._id} 
      p={4} 
      borderWidth={1} 
      borderRadius="md"
      ml={isReply ? 8 : 0}
      borderLeft={isReply ? "4px solid" : undefined}
      borderLeftColor={isReply ? "blue.200" : undefined}
    >
      <HStack justify="space-between" mb={2}>
        <HStack>
          <Avatar
            size="sm"
            name={comment.userId.name}
            src={comment.userId.picture}
          />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize="sm">
              {comment.userId.name}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </VStack>
        </HStack>

        {/* Action Buttons */}
        <HStack>
          {!isReply && (
            <IconButton
              aria-label="Reply to comment"
              icon={<FiMessageSquare />}
              size="sm"
              variant="ghost"
              onClick={() => handleReply(comment)}
              isDisabled={replyingTo?._id === comment._id}
            />
          )}
          {canEditComment(comment) && (
            <IconButton
              aria-label="Edit comment"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              onClick={() => startEditing(comment)}
              isDisabled={editingComment === comment._id}
            />
          )}
          {canDeleteComment(comment) && (
            <IconButton
              aria-label="Delete comment"
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={() => handleDeleteComment(comment._id)}
              isLoading={isDeletingComment}
            />
          )}
        </HStack>
      </HStack>

      {/* Comment Content */}
      {editingComment === comment._id ? (
        <Box>
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            size="sm"
            mb={2}
          />
          <HStack>
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => handleEditComment(comment._id)}
              isLoading={isUpdatingComment}
              loadingText="Saving..."
            >
              <CheckIcon />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelEditing}
            >
              <CloseIcon />
            </Button>
          </HStack>
        </Box>
      ) : (
        <Box>
          <Text>{comment.comment}</Text>
          {comment.mentions && comment.mentions.length > 0 && (
            <HStack mt={2} spacing={1}>
              <Text fontSize="xs" color="gray.500">Mentioned:</Text>
              {comment.mentions.map((mention) => (
                <Badge key={mention._id} size="sm" colorScheme="blue">
                  @{mention.name}
                </Badge>
              ))}
            </HStack>
          )}
        </Box>
      )}

      {/* Show if comment was edited */}
      {comment.updatedAt !== comment.createdAt && (
        <Text fontSize="xs" color="gray.500" mt={1}>
          (edited)
        </Text>
      )}

      {/* Reply form */}
      {replyingTo?._id === comment._id && (
        <Box mt={4} p={3} bg="gray.50" borderRadius="md">
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">
              Replying to @{comment.userId.name}
            </Text>
            <IconButton
              aria-label="Cancel reply"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={cancelReply}
            />
          </HStack>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            size="sm"
            mb={2}
            placeholder="Write your reply..."
          />
          <HStack>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleSubmitReply}
              isLoading={isAddingComment}
              loadingText="Posting..."
            >
              Reply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={cancelReply}
            >
              Cancel
            </Button>
          </HStack>
        </Box>
      )}

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <VStack spacing={2} mt={4} align="stretch">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </VStack>
      )}
    </Box>
  );

  if (isLoading) {
    return (
      <Box textAlign="center" py={4}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Text color="red.500">Failed to load comments</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Comments ({pagination?.totalComments || 0})
      </Text>

      {/* Add Comment Form */}
      <Box mb={6}>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment... Use @username to mention someone"
          size="md"
          mb={2}
          minH="100px"
        />
        <Button
          colorScheme="blue"
          onClick={handleSubmitComment}
          isLoading={isAddingComment}
          loadingText="Adding..."
          disabled={!newComment.trim()}
        >
          Add Comment
        </Button>
      </Box>

      <Divider mb={4} />

      {/* Comments List */}
      <VStack spacing={4} align="stretch">
        {comments.map((comment) => renderComment(comment))}

        {comments.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">No comments yet. Be the first to comment!</Text>
          </Box>
        )}
      </VStack>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Box mt={6} textAlign="center">
          <HStack justify="center" spacing={2}>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <Badge variant="outline">
              Page {pagination.currentPage} of {pagination.totalPages}
            </Badge>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection; 