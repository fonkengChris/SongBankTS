import { SimpleGrid, Text } from "@chakra-ui/react";
import Game from "../entities/Song";
import CriticScore from "./CriticScore";
import DefinitionItem from "./DefinitionItem";
import Song from "../entities/Song";

interface Props {
  song: Song;
}

const SongAttributes = ({ song }: Props) => {
  
  return (
    <SimpleGrid columns={2} as="dl">
      <DefinitionItem term={"Notation"}>
        {/* I need to call the particular document file dynamically */}
        <Text>{song.documentFiles[0].notation.title}</Text>
      </DefinitionItem>
      <DefinitionItem term="MetaScore">
        <CriticScore score={song.metacritic} />
      </DefinitionItem>
      <DefinitionItem term="Category">
        <Text>{song.category.title}</Text>
      </DefinitionItem>
      <DefinitionItem term="Author">
        <Text>{song.author_name}</Text>
      </DefinitionItem>
    </SimpleGrid>
  );
};

export default SongAttributes;
