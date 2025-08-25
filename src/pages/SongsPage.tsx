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
import TrendingSongs from "../components/TrendingSongs";
import PopularSongs from "../components/PopularSongs";

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
        <VStack spacing={{ base: 4, md: 6 }} align="stretch" paddingX="16px">
          <Box maxW="100%" overflow="hidden">
            <SongHeading />
          </Box>
          
          <Box maxW="100%" overflow="hidden">
            <TrendingSongs />
          </Box>

          <Box maxW="100%" overflow="hidden">
            <PopularSongs />
          </Box>

          <Box paddingX={{ base: 2, md: 4, lg: 6 }}>
            {/* Large screens (lg and above) */}
            <Hide below="lg">
              <VStack spacing={4} marginBottom={6} align="stretch">
                {/* Line 1: notation, language, sort selectors */}
                <HStack
                  spacing={4}
                  alignItems="center"
                  width="100%"
                >
                  <Box flex={1}>
                    <NotationSelector />
                  </Box>
                  <Box flex={1}>
                    <LanguageSelector />
                  </Box>
                  <Box flex={1}>
                    <SortSelector />
                  </Box>
                </HStack>
                
                {/* Line 2: search bar */}
                <Box width="100%">
                  <SearchInput />
                </Box>
              </VStack>
            </Hide>

            {/* Small screens (below lg) */}
            <Show below="lg">
              <VStack spacing={4} marginBottom={6} align="stretch">
                {/* Line 1: notation and language selectors */}
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

                {/* Line 2: category and sort selectors */}
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

                {/* Search bar */}
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
