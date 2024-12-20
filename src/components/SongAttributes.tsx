import { SimpleGrid, Text } from "@chakra-ui/react";
// import Song from "../entities/Song";
import CriticScore from "./CriticScore";
import DefinitionItem from "./DefinitionItem";
import Song from "../entities/Song";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";

interface Props {
  song: Song;
}

const SongAttributes = ({ song }: Props) => {
  const category = useCategory(song.category);
  const notation = useNotation(song.documentFiles[0].notation);

  // console.log();
  return (
    <SimpleGrid columns={2} as="dl">
      <DefinitionItem term={"Notation"}>
        {/* I need to call the particular document file dynamically */}
        <Text>{notation!.title}</Text>
      </DefinitionItem>
      <DefinitionItem term="MetaScore">
        <CriticScore score={song.metacritic} />
      </DefinitionItem>
      <DefinitionItem term="Category">
        <Text>{category!.title}</Text>
      </DefinitionItem>
      <DefinitionItem term="Author">
        <Text>{song.authorName}</Text>
      </DefinitionItem>
    </SimpleGrid>
  );
};

export default SongAttributes;
