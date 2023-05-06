import { Card, CardBody, HStack, Icon, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Song from "../entities/Song";
import CriticScore from "./CriticScore";
import Like from "./Like";
import { useState } from "react";
import { BsHeartFill } from "react-icons/bs";

interface Props {
  song: Song;
}

const SongCard = ({ song }: Props) => {
  const [liked, setLiked] = useState(false);
  const handleLike = () => {
    // console.log("hanlde called");
    console.log(liked);
    setLiked(!liked);
    console.log(liked);
  };

  return (
    <Card>
      <Image
        boxSize="300px"
        objectFit="cover"
        src={song.preview_image[0].preview_image}
      />
      <CardBody>
        <Link to={"/songs/" + song.id}>{song.title}</Link>
        <HStack justifyContent="space-between">
          <Text>{song.notation.title}</Text>
          <CriticScore score={song.metacritic} />
          <Like liked={false} onLike={handleLike} />
        </HStack>
        {song.author_name !== "Unknown" && <Text>{song.author_name}</Text>}
      </CardBody>
    </Card>
  );
};

export default SongCard;
