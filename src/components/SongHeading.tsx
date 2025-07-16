import { Heading, Box } from "@chakra-ui/react";
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
    <Box
      paddingTop={{ base: 3, md: 4, lg: 5 }}
      paddingBottom={{ base: 3, md: 4, lg: 5 }}
      paddingLeft={{ base: 4, md: 6, lg: 8 }}
      paddingRight={{ base: 4, md: 6, lg: 8 }}
    >
      <Heading
        textAlign="left"
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
        as="h1"
        lineHeight="1.2"
        fontWeight="bold"
        color="blue.700"
      >
        {heading}
      </Heading>
    </Box>
  );
};

export default SongHeading;
