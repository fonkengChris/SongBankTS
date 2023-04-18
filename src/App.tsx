import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button, Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SongGrid from "./components/SongGrid";
import CategoryList from "./components/GenreList";

function App() {
  const [count, setCount] = useState(0);

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
        <SongGrid />
      </GridItem>
    </Grid>
  );
}

export default App;
