import { Box, background } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import MainNavBar from "../components/MainNavBar";
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
      // console.log(user);
    } catch (error) {}
  }, []);
  return (
    <>
      <div
        style={
          {
            // backgroundImage: `url("https://hackaday.com/wp-content/uploads/2017/05/reading-music-for-machines-featured.jpg?w=800")`,
          }
        }
      >
        <MainNavBar user={user} />
      </div>
      <Box padding={5}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
