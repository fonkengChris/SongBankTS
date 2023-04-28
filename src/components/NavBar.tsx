import {
  Box,
  Flex,
  HStack,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/songBankLogo.png";
import ColorModeSwitch from "./ColorModeSwitch";

interface Props {
  user: CurrentUser;
}

const NavBar = ({ user }: Props) => {
  console.log(user);
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Flex>
        <Link to="/">
          <Image src={logo} boxSize="60px" />
        </Link>
        <Link to="/">
          <Text as="b" color="brown" fontSize="4xl">
            SongBank
          </Text>
        </Link>

        <List className="navbar-nav">
          <HStack padding={2}>
            <ListItem className="nav-item">
              <NavLink className="nav-link" to="/">
                About Us
              </NavLink>
            </ListItem>
            <ListItem className="nav-item">
              <NavLink className="nav-link" to="/">
                Contact Us
              </NavLink>
            </ListItem>
            {!user.user_id && (
              <React.Fragment>
                <ListItem className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </ListItem>
                <ListItem className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </ListItem>
              </React.Fragment>
            )}
            {user.user_id && (
              <React.Fragment>
                <ListItem className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    User_ {user.user_id}
                  </NavLink>
                </ListItem>
                <ListItem className="nav-item">
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </ListItem>
              </React.Fragment>
            )}
          </HStack>
        </List>
      </Flex>

      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
