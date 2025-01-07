import { SimpleGrid, Text } from "@chakra-ui/react";
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
  const { notation } = useNotation(mediaFile.notation._id);

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
