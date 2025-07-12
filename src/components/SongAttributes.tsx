import { SimpleGrid, Text, Spinner } from "@chakra-ui/react";
import CriticScore from "./CriticScore";
import DefinitionItem from "./DefinitionItem";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";
import SongMedia from "../entities/SongMedia";

interface Props {
  mediaFile: SongMedia;
}

const SongAttributes = ({ mediaFile }: Props) => {
  const song = mediaFile.song;
  const category = useCategory(song.category);
  const {
    notation,
    isLoading: notationLoading,
    error: notationError,
  } = useNotation(mediaFile.notation?._id);

  if (notationLoading) return <Spinner />;
  if (notationError) return <Text color="red.500">Error loading notation</Text>;

  return (
    <SimpleGrid columns={2} as="dl">
      {notation && (
        <DefinitionItem term={"Notation"}>
          <Text>{notation.title}</Text>
        </DefinitionItem>
      )}
      <DefinitionItem term="MetaScore">
        <CriticScore score={song.metacritic || 0} />
      </DefinitionItem>
      <DefinitionItem term="Category">
        <Text>{category?.title || "Uncategorized"}</Text>
      </DefinitionItem>
      <DefinitionItem term="Author">
        <Text>{song.authorName}</Text>
      </DefinitionItem>
    </SimpleGrid>
  );
};

export default SongAttributes;
