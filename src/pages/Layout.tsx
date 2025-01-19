import { Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import CurrentUser from "../entities/CurrentUser";
import PayPalProvider from "../components/PayPalProvider";

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
    <PayPalProvider>
      <Box minH="100vh" bg={bgColor}>
        <MainNavBar user={user} />
        <Box padding={5}>
          <Outlet />
        </Box>
      </Box>
    </PayPalProvider>
  );
};

export default Layout;
