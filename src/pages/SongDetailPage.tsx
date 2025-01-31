import { useEffect, useState } from "react";
import {
  Box,
  SimpleGrid,
  GridItem,
  Heading,
  Img,
  Spinner,
  Text,
  HStack,
} from "@chakra-ui/react";
import { Link, Navigate, useParams } from "react-router-dom";
import ExpandableText from "../components/ExpandableText";
import useMedia from "../hooks/useMediaFile";
import useSong from "../hooks/useSong";
import { MEDIA_BASE_URL } from "../data/constants";
import DefinitionItem from "../components/DefinitionItem";
import SongAttributes from "../components/SongAttributes";
import Views from "../components/Views";
import useLike from "../hooks/useLike";
import Like from "../components/Like";
import useUnlike from "../hooks/useUnlike";

const SongDetailPage = () => {
  const jwt = localStorage.getItem("token");
  if (!jwt) return <Navigate to="/auth" />;

  const { id } = useParams();
  if (!id) return <Text color="red.500">Invalid ID.</Text>;

  const {
    media: mediaFile,
    loading: mediaLoading,
    error: mediaError,
  } = useMedia(id!);

  const [likeState, setLikeState] = useState({
    liked: false,
    likesCount: 0,
  });

  // Synchronize likesCount with mediaFile when it loads
  useEffect(() => {
    if (mediaFile?.song) {
      setLikeState((prevState) => ({
        ...prevState,
        likesCount: mediaFile.song.likesCount || 0,
      }));
    }
  }, [mediaFile]);

  const [errorMessage, setErrorMessage] = useState("");

  const { likeSong } = useLike(mediaFile?.song._id!); // Returns a function to like the song
  const { unLikeSong } = useUnlike(mediaFile?.song._id!); // Returns a function to unlike the song

  const handleLike = async () => {
    try {
      setLikeState((prevState) => {
        const newLiked = !prevState.liked;
        return {
          liked: newLiked,
          likesCount: prevState.likesCount + (newLiked ? 1 : -1),
        };
      });

      if (!likeState.liked) {
        await likeSong();
      } else {
        await unLikeSong();
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
      // Revert state in case of an error
      setLikeState((prevState) => ({
        liked: !prevState.liked,
        likesCount: prevState.likesCount + (prevState.liked ? -1 : 1),
      }));
      setErrorMessage("Failed to update like status. Please try again.");
    }
  };

  if (mediaLoading) return <Spinner />;

  // Show error messages if applicable
  if (mediaError) return <Text color="red.500">{mediaError}</Text>;

  // Ensure documentFile and song are available before rendering
  if (!mediaFile) return <Text>No document found.</Text>;
  if (!mediaFile.song) return <Text>No song data found in document.</Text>;

  const { song, documentFile, previewImage, audioFile } = mediaFile;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      {/* First Column */}
      <GridItem>
        <Heading>{song.title}</Heading>
        <Link to={MEDIA_BASE_URL + documentFile}>
          <Img
            src={MEDIA_BASE_URL + previewImage}
            boxSize="700px"
            objectFit="cover"
            alt={`Preview image for ${song?.title || "song"}`}
          />
        </Link>
        <br />
        {audioFile ? (
          <>
            <audio controls src={MEDIA_BASE_URL + audioFile}>
              Your browser does not support the audio element.
            </audio>
            <br />
          </>
        ) : (
          <Text>No audio available for this song.</Text>
        )}

        <br />

        <Heading>Background</Heading>

        <ExpandableText>
          {song!.description || "No description available."}
        </ExpandableText>
      </GridItem>

      {/* Second Column */}
      <GridItem>
        <Heading mt={6}>Lyrics</Heading>
        <Text>{song!.lyrics || "No lyrics available."}</Text>
        <SongAttributes mediaFile={mediaFile!} />

        <SimpleGrid columns={2} as="dl" spacing={4}>
          <DefinitionItem term="Likes">
            <Box>
              <HStack>
                <Like liked={likeState.liked} onLike={handleLike} />
                <Text padding={2}>{likeState.likesCount}</Text>
                {errorMessage && <Text color="red.500">{errorMessage}</Text>}
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
  );
};

export default SongDetailPage;
