import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import CategoryList from "../components/CategoryList";
import NavBar from "../components/NavBar";
import NotationSelector from "../components/NotationSelector";
import SearchInput from "../components/SearchInput";
import SongGrid from "../components/SongGrid";
import SongHeading from "../components/SongHeading";
import SortSelector from "../components/SortSelector";

const HomePage = () => {
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
        <HStack paddingLeft={2} marginBottom={5}>
          <Box marginLeft={3} marginRight={5}>
            <NotationSelector />
          </Box>
          <SortSelector />
          <Box width="70%" marginRight={10}>
            <SearchInput />
          </Box>
        </HStack>
        <Box marginLeft={3}>
          <SongGrid />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
