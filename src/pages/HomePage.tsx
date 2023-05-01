import {
  Box,
  Grid,
  GridItem,
  HStack,
  Heading,
  Show,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import CategoryList from "../components/CategoryList";
import MainNavBar from "../components/MainNavBar";
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
        lg: `"nav nav"  "aside main" "foot foot"`,
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
        <Box marginLeft={5}>{/* <SongHeading /> */}</Box>
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
          {/* <SongGrid /> */}
          <Heading>
            Welcome to the central Song bank where you will find lots of songs
            to suit your needs
          </Heading>
          <Text>Login to start exploring</Text>
        </Box>
      </GridItem>
      <GridItem area="foot">
        <Box>
          <Text justifyContent="center">Nothing to show here guys</Text>
        </Box>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
