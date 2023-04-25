import { Heading } from "@chakra-ui/react";
import useSongQueryStore from "../Store";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";

const SongHeading = () => {
  const categoryId = useSongQueryStore((s) => s.songQuery.categoryId);
  const category = useCategory(categoryId);

  const notationId = useSongQueryStore((s) => s.songQuery.notationId);
  const notation = useNotation(notationId);

  const heading = `${notation?.title || ""} ${category?.title || ""} Songs`;
  return (
    <Heading textAlign="left" marginY={5} fontSize="5xl" as="h1">
      {heading}
    </Heading>
  );
};

export default SongHeading;
