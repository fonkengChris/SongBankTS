import { Box, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";
import { useState, useEffect } from "react";
import CurrentUser from "../entities/CurrentUser";
import PayPalProvider from "../components/PayPalProvider";
import Footer from "../components/Footer";
import useAuth from "../hooks/useAuth";
import { initializeViewTracking } from "../utils/view-tracking";
import PWASplashScreen from "../components/PWASplashScreen";

const Layout = () => {
  const [user, setUser] = useState({} as CurrentUser);
  const { auth } = useAuth();
  const bgColor = useColorModeValue("white", "gray.900");

  useEffect(() => {
    try {
      if (auth.access) {
        // Get user info from the auth context
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          if (decodedToken) {
            setUser(decodedToken as CurrentUser);
          }
        }
      }
    } catch (error) {
      console.error("Error setting user from token:", error);
    }

    // Initialize view tracking
    initializeViewTracking();
  }, [auth.access]);

  return (
    <PayPalProvider>
      <PWASplashScreen />
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
