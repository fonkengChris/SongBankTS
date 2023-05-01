import { Box } from "@chakra-ui/react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";

const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <MainNavBar user={null} />
      <Box padding={5}>
        <h1>Oops...</h1>
        <p>
          {isRouteErrorResponse(error)
            ? "Sorry this page does not exist"
            : "Sorry, an unexpected error has occurred."}
        </p>
        <Link to="/login">Sign In</Link>
      </Box>
    </>
  );
};

export default ErrorPage;
