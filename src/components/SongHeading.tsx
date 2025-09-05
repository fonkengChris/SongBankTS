import { Heading, Box, useColorModeValue } from "@chakra-ui/react";
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

  // Theme-aware colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("blue.600", "blue.400");

  const heading = `${language?.name || ""}  ${notation?.title || ""}  ${
    category?.title || ""
  }   Songs`;

  return (
    <Box
      paddingTop={{ base: 4, md: 6, lg: 8 }}
      paddingBottom={{ base: 4, md: 6, lg: 8 }}
      paddingLeft={{ base: 3, md: 4, lg: 5 }}
      paddingRight={{ base: 3, md: 4, lg: 5 }}
      bg={cardBg}
      borderRadius="xl"
      border="1px solid"
      borderColor={cardBorderColor}
      mb={6}
      maxW="100%"
      overflow="hidden"
      boxSizing="border-box"
    >
      <Heading
        textAlign="left"
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl", lg: "5xl" }}
        as="h1"
        lineHeight="1.1"
        fontWeight="800"
        color={headingColor}
        letterSpacing="-0.03em"
        textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
      >
        {heading}
      </Heading>
    </Box>
  );
};

export default SongHeading;
