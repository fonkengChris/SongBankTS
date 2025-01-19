import {
  Card,
  CardBody,
  HStack,
  Heading,
  Image,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Song from "../entities/Song";
import SongMedia from "../entities/SongMedia";
import PurchaseModal from "./PurchaseModal";

interface Props {
  song: Song;
  mediaFile: SongMedia;
}

const PremiumSongCard = ({ song, mediaFile }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onOpen();
  };

  return (
    <>
      <Card>
        <Link to={`/media_files/${mediaFile._id}`} onClick={handleClick}>
          <Image src={mediaFile.previewImage} />
          <CardBody>
            <HStack justifyContent="space-between">
              <Box>
                <Heading fontSize="2xl">{song.title}</Heading>
                <Button size="sm" colorScheme="yellow" mt={2}>
                  Premium Content
                </Button>
              </Box>
            </HStack>
          </CardBody>
        </Link>
      </Card>

      <PurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        songTitle={song.title}
        price={9.99}
        mediaFileId={mediaFile._id}
      />
    </>
  );
};

export default PremiumSongCard;
