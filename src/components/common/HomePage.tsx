import { Box, Grid, GridItem, HStack, Show } from "@chakra-ui/react";
import { useState } from "react";
import CategoryList from "../CategoryList";
import NavBar from "../NavBar";
import NotationSelector from "../NotationSelector";
import SearchInput from "../SearchInput";
import SongGrid from "../SongGrid";
import SongHeading from "../SongHeading";
import SortSelector from "../SortSelector";

export interface SongQuery {
  categoryId?: number;
  notationId?: number;
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
            selectedCategoryId={songQuery.categoryId}
            onSelectCategory={(category) =>
              setSongQuery({ ...songQuery, categoryId: category?.id })
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
              selectedNotationId={songQuery?.notationId}
              onSelectNotation={(notation) =>
                setSongQuery({ ...songQuery, notationId: notation?.id })
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
