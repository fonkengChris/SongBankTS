import {
  Box,
  GridItem,
  Heading,
  Img,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { Document } from "react-pdf";
import { Link, useParams } from "react-router-dom";
import ExpandableText from "../components/ExpandableText";
import SongAttributes from "../components/SongAttributes";
import useSong from "../hooks/useSong";
import DocumentFile from "../components/DocumentFile";

const SongDetialPage = () => {
  const { id } = useParams();
  const { data: song, isLoading, error } = useSong(id!);

  if (isLoading) return <Spinner />;
  if (error || !song) throw error;

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
      <GridItem>
        <Heading>{song.title}</Heading>
        {song.preview_image.map((file) => (
          // <Document key={file.id} file={file.document_file}>
          //   {file.document_file}
          // </Document>

          <Link key={file.id} to={song.document_files[0].document_file}>
            <Img src={file.preview_image} />
          </Link>
        ))}
        <br />
        {song.audio_files.map((file) => (
          <audio controls key={file.id} src={file.audio_file} />
        ))}
      </GridItem>
      <GridItem>
        <ExpandableText>{song.description}</ExpandableText>
        <SongAttributes song={song} />
      </GridItem>
    </SimpleGrid>
  );
};

export default SongDetialPage;