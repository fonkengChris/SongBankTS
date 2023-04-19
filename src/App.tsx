import { useState } from "react";
import "./App.css";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SongGrid from "./components/SongGrid";
import CategoryList from "./components/CategoryList";
import { Category } from "./hooks/useCategories";
import NotationSelector from "./components/NotationSelector";
import { Notation } from "./hooks/useSongs";

// interface SongQuery {
//   category: Category | null;
//   notation: Notation | null;
// }

function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedNotation, setSelectedNotation] = useState<Notation | null>(
    null
  );

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
          <CategoryList
            selectedCategory={selectedCategory}
            onSelectCategory={(category) => {
              setSelectedCategory(category);
            }}
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <NotationSelector
          selectedNotation={selectedNotation}
          onSelectNotation={(notation) => setSelectedNotation(notation)}
        />
        <SongGrid
          selectedCategory={selectedCategory}
          selectedNotation={selectedNotation}
        />
      </GridItem>
    </Grid>
  );
}

export default App;
