import { Box } from "@chakra-ui/react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NavBar from "../components/NavBar";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <NavBar />
      <Box padding={5}>
        <h1>Oops...</h1>
        <p>
          {isRouteErrorResponse(error)
            ? "Sorry this page does not exist"
            : "Sorry, an unexpected error has occurred."}
        </p>
      </Box>
    </>
  );
};

export default ErrorPage;
