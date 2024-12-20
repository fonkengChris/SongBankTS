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
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import DefinitionItem from "../components/DefinitionItem";
import ExpandableText from "../components/ExpandableText";
import Like from "../components/Like";
import SongAttributes from "../components/SongAttributes";
import Views from "../components/Views";
import useSong from "../hooks/useSong";

import { MEDIA_BASE_URL } from "../data/constants";

const SongDetailPage = () => {
  const jwt = localStorage.getItem("token");
  if (!jwt) return <Navigate to="/login" />;

  const { id } = useParams();
  const { data: song, isLoading, error } = useSong(id!);

  // const likes = song?.likes_count!;
  // const views = song?.views!;

  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked === false) {
      setLiked(true);
      // setLikesCount(likesCount! + 1);
      // axiosLikeInstance
      //   .patch(`${song?._id!}/`, {
      //     likes_count: song?.likes_count! + 1,
      //   })
      //   .then((response) => {
      //     console.log(response.data); // Updated song data
      //     // Handle any further actions or UI updates
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //     // Handle error scenarios
      //   });
      // console.log("patch called");
    } else {
      setLiked(false);
      // setLikesCount(likesCount! - 1);
    }
  };

  // const handleView = () => {
  //   setViewsCount(viewsCount! + 1);
  //   axiosLikeInstance
  //     .patch(`${song?._id!}/`, {
  //       views: song?.views! + 1,
  //     })
  //     .then((response) => {
  //       console.log(response.data); // Updated song data
  //       // Handle any further actions or UI updates
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       // Handle error scenarios
  //     });
  // };

  if (isLoading) return <Spinner />;
  if (error || !song) throw error;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      <GridItem>
        <Heading>{song.title}</Heading>
        {/* This area needs some seriour re-working starting here*/}
        {song.documentFiles.map((file) => (
          <Link
            key={file._id}
            to={MEDIA_BASE_URL + song.documentFiles[0].documentFile}
            // onClick={handleView}
          >
            <Img
              src={MEDIA_BASE_URL + file.previewImage}
              boxSize="700px"
              objectFit="cover"
            />
          </Link>
        ))}
        {/* This area needs some seriour re-working ending here*/}

        <br />
        <audio
          controls
          key={song.audioFile._id}
          src={MEDIA_BASE_URL + song.audioFile.audioFile}
        />

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
                <Text padding={2}>{song.likesCount}</Text>
              </HStack>
            </Box>
          </DefinitionItem>
          <DefinitionItem term="Views">
            <Box>
              <HStack>
                {/* <Views onView={handleView} /> */}
                <Text padding={2}>{song.views}</Text>
              </HStack>
            </Box>
          </DefinitionItem>
        </SimpleGrid>{" "}
      </GridItem>
    </SimpleGrid>
  );
};

export default SongDetailPage;
