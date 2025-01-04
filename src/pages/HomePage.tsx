import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

const HomePage = () => {
  const jwt = localStorage.getItem("token");
  if (jwt) return <Navigate to="/songs" />;

  return (
    <Grid
      templateAreas={{
        base: `"nav" "main"`,
        lg: `"nav nav"  "main main" "foot foot"`,
      }}
      templateColumns={{
        base: "1fr",
        lg: "200px 1fr",
      }}
    >
      <GridItem area="main">
        <Box marginLeft={3}>
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
