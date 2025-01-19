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

const SongCard = ({ song, mediaFile }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Check if song is premium (you might want to add this field to your Song entity)
  const isPremium = song.title === "Premium Song"; // This is our dummy premium song

  const handleClick = (event: React.MouseEvent) => {
    if (isPremium) {
      event.preventDefault();
      onOpen();
    }
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
                {isPremium && (
                  <Button size="sm" colorScheme="yellow" mt={2}>
                    Premium Content
                  </Button>
                )}
              </Box>
            </HStack>
          </CardBody>
        </Link>
      </Card>

      <PurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        songTitle={song.title}
        price={9.99} // Set your price
        mediaFileId={mediaFile._id}
      />
    </>
  );
};

export default SongCard;
