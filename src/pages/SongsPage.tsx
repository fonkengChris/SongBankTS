import {
  Box,
  Grid,
  GridItem,
  HStack,
  Show,
  VStack,
  Hide,
} from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import NotationSelector from "../components/NotationSelector";
import SearchInput from "../components/SearchInput";
import SongGrid from "../components/SongGrid";
import SongHeading from "../components/SongHeading";
import SortSelector from "../components/SortSelector";
import LanguageSelector from "../components/LanguageSelector";
import CategorySelector from "../components/CategorySelector";

const SongsPage = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav"  "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "250px 1fr",
      }}
      gap={{ base: 4, lg: 6 }}
      minHeight="100vh"
    >
      <Show above="lg">
        <GridItem area="aside" position="sticky" top={4} height="fit-content">
          <CategoryList />
        </GridItem>
      </Show>
      <GridItem area="main">
        <VStack spacing={{ base: 4, md: 6 }} align="stretch">
          <SongHeading />

          <Box paddingX={{ base: 4, md: 6, lg: 8 }}>
            {/* Desktop Layout */}
            <Hide below="lg">
              <HStack
                spacing={{ base: 3, md: 4, lg: 5 }}
                marginBottom={6}
                alignItems="center"
                flexWrap="wrap"
                gap={4}
              >
                <NotationSelector />
                <LanguageSelector />
                <SortSelector />
                <Box flex={1} minWidth="200px">
                  <SearchInput />
                </Box>
              </HStack>
            </Hide>

            {/* Mobile/Tablet Layout */}
            <Show below="lg">
              <VStack spacing={4} marginBottom={6} align="stretch">
                {/* First row of filters */}
                <HStack
                  spacing={3}
                  width="100%"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box flex={1} minWidth="140px">
                    <NotationSelector />
                  </Box>
                  <Box flex={1} minWidth="140px">
                    <LanguageSelector />
                  </Box>
                </HStack>

                {/* Second row of filters */}
                <HStack
                  spacing={3}
                  width="100%"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box flex={1} minWidth="140px">
                    <CategorySelector />
                  </Box>
                  <Box flex={1} minWidth="140px">
                    <SortSelector />
                  </Box>
                </HStack>

                {/* Search input */}
                <Box width="100%">
                  <SearchInput />
                </Box>
              </VStack>
            </Show>

            <SongGrid />
          </Box>
        </VStack>
      </GridItem>
    </Grid>
  );
};

export default SongsPage;
