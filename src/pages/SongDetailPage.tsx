import { useEffect, useState, useRef } from "react";
import {
  Box,
  SimpleGrid,
  GridItem,
  Heading,
  Img,
  Spinner,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { Link, Navigate, useParams } from "react-router-dom";
import ExpandableText from "../components/ExpandableText";
import useMedia from "../hooks/useMediaFile";
import { MEDIA_BASE_URL } from "../data/constants";
import DefinitionItem from "../components/DefinitionItem";
import SongAttributes from "../components/SongAttributes";
import Views from "../components/Views";
import Like from "../components/Like";
import useLikeManager from "../hooks/useLikeManager";
import { useEnhancedTrackView } from "../hooks/useTrackView";
import YouTube from "react-youtube";
import CommentSection from "../components/CommentSection";
import useAuth from "../hooks/useAuth";

const SongDetailPage = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth" />;

  const { id } = useParams();
  if (!id) return <Text color="red.500">Invalid ID.</Text>;

  const {
    media: mediaFile,
    loading: mediaLoading,
    error: mediaError,
  } = useMedia(id!);

  const [errorMessage, setErrorMessage] = useState("");

  // Get the song ID from the media file
  const songId = mediaFile?.song?._id;

  // Use the new like status hook only when we have a valid songId
  const {
    isLiked,
    likesCount,
    loading: likeLoading,
    error: likeError,
    toggleLike,
    refresh: refreshLikeStatus,
  } = useLikeManager(songId);

  // Track view when song is accessed (only once per session)
  const { trackViewOnce } = useEnhancedTrackView();

  const handleLike = async () => {
    if (!songId) return;

    try {
      await toggleLike();
      setErrorMessage(""); // Clear any existing error message
    } catch (error: any) {
      console.error("Error toggling like status:", error);
      setErrorMessage(
        error.message || "Failed to update like status. Please try again."
      );
    }
  };

  // Track view when component mounts and song is loaded (only once per session)
  useEffect(() => {
    if (songId && mediaFile && !mediaLoading) {
      trackViewOnce(songId);
    }
  }, [songId, mediaLoading, trackViewOnce]);

  // Update the return type to string | undefined
  const getYoutubeVideoId = (url?: string): string | undefined => {
    if (!url) return undefined;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : undefined; // Return undefined instead of null
  };

  if (mediaLoading) return <Spinner />;

  // Show error messages if applicable
  if (mediaError) return <Text color="red.500">{mediaError}</Text>;

  // Ensure documentFile and song are available before rendering
  if (!mediaFile) return <Text>No document found.</Text>;

  // Fallback: If no song, show media file info
  if (!mediaFile.song) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <GridItem>
          <Heading>{mediaFile.name}</Heading>
          <Box padding={6} bg="gray.800" borderRadius="md" color="white">
            <Link to={mediaFile.documentFile}>
              <Img
                src={mediaFile.previewImage}
                boxSize="700px"
                objectFit="cover"
                alt={`Preview image for ${mediaFile.name}`}
              />
            </Link>
          </Box>
          <br />
          {mediaFile.audioFile ? (
            <Box padding={6} bg="gray.800" borderRadius="md" color="white">
              <audio 
                controls 
                src={mediaFile.audioFile} 
                style={{ 
                  width: "300px", 
                  maxWidth: "100%",
                  height: "40px"
                }}
              >
                Your browser does not support the audio element.
              </audio>
            </Box>
          ) : (
            <Text>No audio available for this song.</Text>
          )}
          <Box padding={6} mt={4} bg="gray.800" borderRadius="md" color="white">
            <Heading>Notation</Heading>
            <Text>
              {mediaFile.notation?.title ||
                (mediaFile.notation
                  ? "Notation available"
                  : "No notation available")}
            </Text>
          </Box>
        </GridItem>
        <GridItem>
          <Box padding={8} bg="gray.800" borderRadius="md" color="white">
            <Heading mt={6}>Document</Heading>
            <Text>
              <a
                href={mediaFile.documentFile}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#63B3ED' }}
              >
                View Document
              </a>
            </Text>
          </Box>
        </GridItem>
      </SimpleGrid>
    );
  }

  const { song, documentFile, previewImage, audioFile } = mediaFile;

  return (
    <VStack spacing={8} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {/* First Column */}
        <GridItem>
          <Heading>{song.title}</Heading>
          <Box padding={6} bg="gray.800" borderRadius="md" color="white">
            <Link to={documentFile}>
              <Img
                src={previewImage}
                boxSize="700px"
                objectFit="cover"
                alt={`Preview image for ${song?.title || "song"}`}
              />
            </Link>
          </Box>
          <br />
          {audioFile ? (
            <Box padding={6} bg="gray.800" borderRadius="md" color="white">
              <audio 
                controls 
                src={audioFile} 
                style={{ 
                  width: "300px", 
                  maxWidth: "100%",
                  height: "40px"
                }}
              >
                Your browser does not support the audio element.
              </audio>
            </Box>
          ) : (
            <Text>No audio available for this song.</Text>
          )}

          <Box padding={6} mt={4} bg="gray.800" borderRadius="md" color="white">
            <Heading>Background</Heading>
            <ExpandableText>
              {song!.description || "No description available."}
            </ExpandableText>
          </Box>
        </GridItem>

        {/* Second Column */}
        <GridItem>
          {song.youtubeUrl && (
            <>
              <Box my={4} width="100%" display="flex" justifyContent="center">
                <Box width={{ base: "80%", md: "500px" }}>
                  <YouTube
                    videoId={getYoutubeVideoId(song.youtubeUrl)}
                    opts={{
                      width: "100%",
                      height: "300",
                      playerVars: {
                        autoplay: 0,
                      },
                    }}
                  />
                </Box>
              </Box>
              <br />
            </>
          )}
          
          <Heading mt={6}>Lyrics</Heading>
          <Box padding={6} bg="gray.800" borderRadius="md" color="white">
            <Text>{song!.lyrics || "No lyrics available."}</Text>
          </Box>
          
          <Box padding={6} bg="gray.800" borderRadius="md" color="white">
            <SongAttributes mediaFile={mediaFile!} />
          </Box>

          <SimpleGrid columns={2} as="dl" spacing={4}>
            <DefinitionItem term="Likes">
              <Box>
                <HStack>
                  {likeLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <Like liked={isLiked} onLike={handleLike} />
                  )}
                  <Text
                    padding={2}
                    transition="all 0.2s ease-in-out"
                    color={isLiked ? "red.500" : "inherit"}
                  >
                    {likesCount}
                  </Text>
                  {(errorMessage || likeError) && (
                    <Text color="red.500">{errorMessage || likeError}</Text>
                  )}
                </HStack>
              </Box>
            </DefinitionItem>
            <DefinitionItem term="Views">
              <Box>
                <HStack>
                  <Views />
                  <Text padding={2}>{song!.views}</Text>
                </HStack>
              </Box>
            </DefinitionItem>
          </SimpleGrid>
        </GridItem>
      </SimpleGrid>

      {/* Comments Section */}
      <Box padding={8} bg="gray.800" borderRadius="md" color="white">
        <CommentSection songId={songId!} />
      </Box>
    </VStack>
  );
};

export default SongDetailPage;
