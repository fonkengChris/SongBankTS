import {
  Box,
  GridItem,
  HStack,
  Heading,
  Img,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import DefinitionItem from "../components/DefinitionItem";
import ExpandableText from "../components/ExpandableText";
import Like from "../components/Like";
import SongAttributes from "../components/SongAttributes";
import Views from "../components/Views";
import useSong from "../hooks/useSong";

const SongDetialPage = () => {
  const jwt = localStorage.getItem("token");
  if (!jwt) return <Navigate to="/login" />;

  const { id } = useParams();
  const { data: song, isLoading, error } = useSong(id!);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(50);
  const [viewsCount, setViewsCount] = useState(song?.views);

  const handleLike = () => {
    if (liked === false) {
      setLiked(true);
      setLikesCount(likesCount! + 1);
    } else {
      setLiked(false);
      setLikesCount(likesCount! - 1);
    }
  };

  const handleView = () => {
    //send update request to the database
  };

  console.log(song);

  if (isLoading) return <Spinner />;
  if (error || !song) throw error;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      <GridItem>
        <Heading>{song.title}</Heading>
        {song.preview_image.map((file) => (
          <Link key={file.id} to={song.document_files[0].document_file} onClick={handleView}>
            <Img src={file.preview_image} boxSize="700px" objectFit="cover" />
          </Link>
        ))}
        <br />
        {song.audio_files.map((file) => (
          <audio controls key={file.id} src={file.audio_file} />
        ))}
        <ExpandableText>{song.description}</ExpandableText>
      </GridItem>
      <GridItem>
        <Heading>Lyrics</Heading>
        <Text>{song.lyrics}</Text>
        <SongAttributes song={song} />
        <SimpleGrid columns={2} as="dl">
          <DefinitionItem term="Likes">
            <Box>
              <HStack>
                <Like liked={liked} onLike={handleLike} />
                <Text padding={2}>{likesCount}</Text>
              </HStack>
            </Box>
          </DefinitionItem>
          <DefinitionItem term="Views">
            <Box>
              <HStack>
                <Views onView={handleView} />
                <Text padding={2}>{song.views + 1}</Text>
              </HStack>
            </Box>
          </DefinitionItem>
        </SimpleGrid>{" "}
      </GridItem>
    </SimpleGrid>
  );
};

export default SongDetialPage;
