import { Grid, GridItem, Show, HStack, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import CategoryList from "../CategoryList";
import NavBar from "../NavBar";
import NotationSelector from "../NotationSelector";
import SearchInput from "../SearchInput";
import SongGrid from "../SongGrid";
import SongHeading from "../SongHeading";
import SortSelector from "../SortSelector";
import { useState } from "react";
import { Category } from "../../hooks/useCategories";
import { Notation } from "../../hooks/useNotations";

export interface SongQuery {
  category: Category | null;
  notation: Notation | null;
  sortOrder: string;
  searchText: string;
}

const HomePage = () => {
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
        <Box marginLeft={5}>
          <SongHeading songQuery={songQuery} />
        </Box>
        <HStack paddingLeft={2} marginBottom={5}>
          <Box marginLeft={3} marginRight={5}>
            <NotationSelector
              selectedNotation={songQuery?.notation}
              onSelectNotation={(notation) =>
                setSongQuery({ ...songQuery, notation })
              }
            />
          </Box>
          <SortSelector
            sortOrder={songQuery.sortOrder}
            onSelectSortOrder={(sortOrder) =>
              setSongQuery({ ...songQuery, sortOrder })
            }
          />
          <Box width="70%" marginRight={10}>
            <SearchInput
              onSearch={(searchText) =>
                setSongQuery({ ...songQuery, searchText })
              }
            />
          </Box>
        </HStack>
        <Box marginLeft={3}>
          <SongGrid songQuery={songQuery} />
        </Box>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
