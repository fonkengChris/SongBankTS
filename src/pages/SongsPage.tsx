import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import { Navigate } from "react-router-dom";
import NotationSelector from "../components/NotationSelector";
import SearchInput from "../components/SearchInput";
import SongGrid from "../components/SongGrid";
import SongHeading from "../components/SongHeading";
import SortSelector from "../components/SortSelector";
import LanguageSelector from "../components/LanguageSelector";
import CategorySelector from "../components/CategorySelector";

const SongsPage = () => {
  const jwt = localStorage.getItem("token");
  if (!jwt) return <Navigate to="/auth" />;

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav"  "aside main"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <Show above="lg">
        <GridItem area="aside">
          <CategoryList />
        </GridItem>
      </Show>
      <GridItem area="main">
        <SongHeading />
        <Box paddingX={8}>
          <Show above="lg">
            <HStack spacing={5} marginBottom={5} alignItems="center">
              <NotationSelector />
              <LanguageSelector />
              <SortSelector />
              <Box flex={1}>
                <SearchInput />
              </Box>
            </HStack>
          </Show>

          <Show below="lg">
            <Box marginBottom={5}>
              <HStack
                spacing={5}
                marginBottom={3}
                width="100%"
                alignItems="center"
              >
                <NotationSelector />
                <LanguageSelector />
              </HStack>

              <HStack
                spacing={5}
                marginBottom={3}
                width="100%"
                alignItems="center"
              >
                <CategorySelector />
                <SortSelector />
              </HStack>

              <Box marginBottom={3}>
                <SearchInput />
              </Box>
            </Box>
          </Show>

          <SongGrid />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SongsPage;
