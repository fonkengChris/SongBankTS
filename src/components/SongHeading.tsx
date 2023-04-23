import { Heading } from "@chakra-ui/react";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";
import { SongQuery } from "./common/HomePage";

interface Props {
  songQuery: SongQuery;
}

const SongHeading = ({ songQuery }: Props) => {
  const category = useCategory(songQuery.categoryId);
  const notation = useNotation(songQuery.notationId);

  const heading = `${notation?.title || ""} ${category?.title || ""} Songs`;
  return (
    <Heading textAlign="left" marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default SongHeading;
