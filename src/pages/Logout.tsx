import { Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearViewedSongs } from "../utils/view-tracking";

const Logout = () => {
  useEffect(() => {
    // Clear viewed songs on logout
    clearViewedSongs();
  }, []);

  return (
    <div>
      <Text>You have successfully logged out</Text>
      <Link to="/auth">Sign In</Link>
    </div>
  );
};

export default Logout;
