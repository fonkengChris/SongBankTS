import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";

const Layout = () => {
  const [user, setUser] = useState({} as CurrentUser);

  useEffect(() => {
    try {
      const access = localStorage.getItem("token");
      // console.log(access);
      const currentUser = jwtDecode<CurrentUser>(access!);
      setUser({ ...currentUser });
      console.log(user);
    } catch (error) {}
  }, []);
  return (
    <>
      <NavBar user={user} />
      <Box padding={5}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
