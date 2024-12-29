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
import useMedia from "../hooks/useMedia";
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
  const {
    media: mediaFile,
    loading: mediaLoading,
    error: mediaError,
  } = useMedia(id!);

  const [likesCount, setLikesCount] = useState(
    mediaFile?.song?.likesCount || 0
  );
  const [liked, setLiked] = useState(false);

  // Assuming useLike and useUnlike are hooks that return functions
  const { likeSong } = useLike(mediaFile?.song._id!); // Returns a function to like the song
  const { unLikeSong } = useUnlike(mediaFile?.song._id!); // Returns a function to unlike the song

  const handleLike = async () => {
    try {
      if (!liked) {
        setLiked(true);
        setLikesCount((prevLikes) => prevLikes + 1); // Optimistic update
        await likeSong(); // Call the function returned by the hook
      } else {
        setLiked(false);
        setLikesCount((prevLikes) => prevLikes - 1); // Optimistic update
        await unLikeSong(); // Call the function returned by the hook
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
      // Revert optimistic update in case of an error
      setLiked((prevLiked) => !prevLiked);
      setLikesCount((prevLikes) => (liked ? prevLikes - 1 : prevLikes + 1));
    }
  };

  if (mediaLoading) return <Spinner />;

  // Show error messages if applicable
  if (mediaError) return <Text color="red.500">{mediaError}</Text>;

  // Ensure documentFile and song are available before rendering
  if (!mediaFile) return <Text>No document found.</Text>;
  if (!mediaFile.song) return <Text>No song data found in document.</Text>;

  const song = mediaFile.song;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      {/* First Column */}
      <GridItem>
        <Heading>{mediaFile!.song.title}</Heading>
        <Link to={MEDIA_BASE_URL + mediaFile!.documentFile}>
          <Img
            src={MEDIA_BASE_URL + mediaFile!.previewImage}
            boxSize="700px"
            objectFit="cover"
          />
        </Link>
        <br />
        {mediaFile?.audioFile && (
          <>
            <audio controls src={MEDIA_BASE_URL + mediaFile!.audioFile} />
            <br />
          </>
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
                <Like liked={liked} onLike={handleLike} />
                <Text padding={2}>{song!.likesCount}</Text>
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
