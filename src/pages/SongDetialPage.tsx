import { Box, GridItem, Heading, SimpleGrid, Spinner } from "@chakra-ui/react";
import { Document } from "react-pdf";
import { useParams } from "react-router-dom";
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
        {song.document_files.map((file) => (
          // <Document key={file.id} file={file.document_file}>
          //   {file.document_file}
          // </Document>
          <DocumentFile key={file.id} url={file.document_file} />
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
