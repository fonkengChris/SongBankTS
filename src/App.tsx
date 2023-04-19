import { useState } from "react";
import "./App.css";
import { Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SongGrid from "./components/SongGrid";
import CategoryList from "./components/CategoryList";
import { Category } from "./hooks/useCategories";
import NotationSelector from "./components/NotationSelector";
import { Notation } from "./hooks/useSongs";
import SortSelector from "./components/SortSelector";

export interface SongQuery {
  category: Category | null;
  notation: Notation | null;
  sortOrder: string;
}

function App() {
  const [songQuery, setSongQuery] = useState<SongQuery>({} as SongQuery);

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
            selectedCategory={songQuery.category}
            onSelectCategory={(category) =>
              setSongQuery({ ...songQuery, category })
            }
          />
        </GridItem>
      </Show>
      <GridItem area="main">
        <HStack spacing={5} paddingLeft={2} marginBottom={5}>
          <NotationSelector
            selectedNotation={songQuery?.notation}
            onSelectNotation={(notation) =>
              setSongQuery({ ...songQuery, notation })
            }
          />
          <SortSelector
            sortOrder={songQuery.sortOrder}
            onSelectSortOrder={(sortOrder) =>
              setSongQuery({ ...songQuery, sortOrder })
            }
          />
        </HStack>
        <SongGrid songQuery={songQuery} />
      </GridItem>
    </Grid>
  );
}

export default App;
