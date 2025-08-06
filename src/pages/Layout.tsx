import { Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import CurrentUser from "../entities/CurrentUser";
import PayPalProvider from "../components/PayPalProvider";
import Footer from "../components/Footer";
import { getValidToken, decodeToken } from "../utils/jwt-validator";
import { initializeViewTracking } from "../utils/view-tracking";

const Layout = () => {
  const [user, setUser] = useState({} as CurrentUser);
  const bgColor = useColorModeValue("white", "gray.900");

  useEffect(() => {
    try {
      const token = getValidToken();
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          setUser(decodedToken as CurrentUser);
        }
      }
    } catch (error) {
      console.error("Error setting user from token:", error);
    }

    // Initialize view tracking
    initializeViewTracking();
  }, []);

  return (
    <PayPalProvider>
      <Box minH="100vh" bg={bgColor} display="flex" flexDirection="column">
        <MainNavBar user={user} />
        <Box flex="1">
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </PayPalProvider>
  );
};

export default Layout;
