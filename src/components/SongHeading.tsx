import { Heading } from "@chakra-ui/react";
import useSongQueryStore from "../Store";
import useCategory from "../hooks/useCategory";
import useNotation from "../hooks/useNotation";
import useLanguage from "../hooks/useLanguage";

const SongHeading = () => {
  const categoryId = useSongQueryStore((s) => s.songQuery.categoryId);
  const category = useCategory(categoryId);

  const notationId = useSongQueryStore((s) => s.songQuery.notationId);
  const { notation } = useNotation(notationId || undefined);

  const languageId = useSongQueryStore((s) => s.songQuery.languageId);
  const language = useLanguage(languageId);

  const heading = `${language?.name || ""}  ${notation?.title || ""}  ${
    category?.title || ""
  }   Songs`;
  return (
    <Heading textAlign="left" marginY={5} fontSize="5xl" as="h3">
      {heading}
    </Heading>
  );
};

export default SongHeading;
