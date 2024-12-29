import { Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Logout = () => {
  return (
    <div>
      <Text>You have successfully logged out</Text>
      <Link to="/auth">Sign In</Link>
    </div>
  );
};

export default Logout;
