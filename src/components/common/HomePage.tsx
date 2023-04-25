import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import { useState } from "react";
import CategoryList from "../CategoryList";
import NavBar from "../NavBar";
import NotationSelector from "../NotationSelector";
import SearchInput from "../SearchInput";
import SongGrid from "../SongGrid";
import SongHeading from "../SongHeading";
import SortSelector from "../SortSelector";


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
      <GridItem area="nav">
        <NavBar />
      </GridItem>
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
