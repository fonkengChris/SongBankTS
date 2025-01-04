import { Box, background, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";

const Layout = () => {
  const [user, setUser] = useState({} as CurrentUser);
  const bgColor = useColorModeValue("white", "gray.900");

  useEffect(() => {
    try {
      const access = localStorage.getItem("token");
      const currentUser = jwtDecode<CurrentUser>(access!);
      setUser({ ...currentUser });
    } catch (error) {}
  }, []);
  return (
    <>
      <div
        style={{
          backgroundColor: `var(--chakra-colors-${bgColor.replace(".", "-")})`,
          minHeight: "100vh",
        }}
      >
        <MainNavBar user={user} />
        <Box padding={5} bg={bgColor}>
          <Outlet />
        </Box>
      </div>
    </>
  );
};

export default Layout;
