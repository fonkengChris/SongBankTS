import { IconButton, Icon, Tooltip } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { useFavouriteStatus, useToggleFavourite } from "../hooks/useFavourites";

interface FavouriteButtonProps {
  songId: string;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const FavouriteButton = ({ songId, size = "md", showTooltip = true }: FavouriteButtonProps) => {
  const { data: status, isLoading } = useFavouriteStatus(songId);
  const toggleFavourite = useToggleFavourite();

  const isFavourited = status?.isFavourited || false;

  const handleToggle = () => {
    toggleFavourite.mutate({
      songId,
      isFavourited,
    });
  };

  const button = (
    <IconButton
      aria-label={isFavourited ? "Remove from favourites" : "Add to favourites"}
      icon={<Icon as={FaStar} />}
      size={size}
      colorScheme={isFavourited ? "yellow" : "gray"}
      variant={isFavourited ? "solid" : "outline"}
      onClick={handleToggle}
      isLoading={isLoading || toggleFavourite.isLoading}
      isDisabled={isLoading || toggleFavourite.isLoading}
      _hover={{
        bg: isFavourited ? "yellow.500" : "gray.100",
        transform: "scale(1.1)",
      }}
      transition="all 0.2s"
    />
  );

  if (showTooltip) {
    return (
      <Tooltip
        label={isFavourited ? "Remove from favourites" : "Add to favourites"}
        placement="top"
        hasArrow
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default FavouriteButton;
