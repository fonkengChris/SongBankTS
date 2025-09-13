import { SimpleGrid, Text, Spinner, HStack, Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import CriticScore from "./CriticScore";
import DefinitionItem from "./DefinitionItem";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";
import { useFavouriteStatus, useToggleFavourite } from "../hooks/useFavourites";
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

  // Get favourite status and toggle function
  const { data: favouriteStatus, isLoading: favouriteLoading } = useFavouriteStatus(song._id);
  const toggleFavourite = useToggleFavourite();

  const isFavourited = favouriteStatus?.isFavourited || false;
  const favouritesCount = favouriteStatus?.favouritesCount ?? song.favouritesCount ?? 0;

  const handleToggleFavourite = () => {
    toggleFavourite.mutate({
      songId: song._id,
      isFavourited,
    });
  };

  // Show loading state while data is being fetched
  if (notationLoading) return <Spinner />;

  // Show error state if there's an error
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
      <DefinitionItem term="Favourites">
        <HStack spacing={2}>
          <Tooltip
            label={isFavourited ? "Remove from favourites" : "Add to favourites"}
            placement="top"
            hasArrow
          >
            <IconButton
              aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
              icon={<Icon as={FaStar} />}
              size="sm"
              colorScheme={isFavourited ? "yellow" : "gray"}
              variant={isFavourited ? "solid" : "outline"}
              onClick={handleToggleFavourite}
              isLoading={favouriteLoading || toggleFavourite.isLoading}
              isDisabled={favouriteLoading || toggleFavourite.isLoading}
              _hover={{
                bg: isFavourited ? "yellow.500" : "gray.100",
                transform: "scale(1.1)",
              }}
              transition="all 0.2s"
            />
          </Tooltip>
          <Text>{favouritesCount}</Text>
        </HStack>
      </DefinitionItem>
    </SimpleGrid>
  );
};

export default SongAttributes;
