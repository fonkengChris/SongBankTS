import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
// import MainNavBar from "../components/MainNavBar";
import { Navigate } from "react-router-dom";
import NotationSelector from "../components/NotationSelector";
import SearchInput from "../components/SearchInput";
import SongGrid from "../components/SongGrid";
import SongHeading from "../components/SongHeading";
import SortSelector from "../components/SortSelector";
import LanguageSelector from "../components/LanguageSelector";
import CategorySelector from "../components/CategorySelector";
import PurchaseSection from "../components/PurchaseSection";

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
        <Box marginLeft={5}>
          <SongHeading />
        </Box>

        
        <Show above="lg">
          <HStack paddingLeft={2} marginBottom={5}>
            <Box marginLeft={3} marginRight={5}>
              <NotationSelector />
            </Box>
            <Box marginLeft={3} marginRight={5}>
              <LanguageSelector />
            </Box>
            <SortSelector />
            <Box width="70%" marginRight={10}>
              <SearchInput />
            </Box>
          </HStack>
        </Show>

        <Show below="lg">
          <Box paddingLeft={2} marginBottom={5}>
            <HStack marginBottom={3}>
              <Box marginLeft={3} marginRight={5}>
                <NotationSelector />
              </Box>
              <Box marginLeft={3}>
                <LanguageSelector />
              </Box>
            </HStack>

            <HStack marginBottom={3}>
              <Box marginLeft={3} marginRight={5}>
                <CategorySelector />
              </Box>
              <Box marginLeft={3}>
                <SortSelector />
              </Box>
            </HStack>

            <Box marginLeft={3} marginRight={3} marginBottom={3}>
              <SearchInput />
            </Box>
          </Box>
        </Show>

        <Box marginLeft={3}>
          <SongGrid />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default SongsPage;
