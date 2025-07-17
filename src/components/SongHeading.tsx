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
      paddingTop={{ base: 6, md: 8, lg: 10 }}
      paddingBottom={{ base: 6, md: 8, lg: 10 }}
      paddingLeft={{ base: 6, md: 8, lg: 10 }}
      paddingRight={{ base: 6, md: 8, lg: 10 }}
      bg="gray.800"
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.700"
      mb={8}
    >
      <Heading
        textAlign="left"
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
        as="h1"
        lineHeight="1.1"
        fontWeight="800"
        color="blue.400"
        letterSpacing="-0.03em"
        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        {heading}
      </Heading>
    </Box>
  );
};

export default SongHeading;
