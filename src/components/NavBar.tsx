import {
  Box,
  Button,
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
      </Flex>

      <HStack justifyContent="space-between" padding={2}>
        <List className="navbar-nav">
          <Flex>
            <ListItem className="nav-item">
              <Button>
                <NavLink className="nav-link" to="/">
                  About Us
                </NavLink>
              </Button>
            </ListItem>
            <ListItem className="nav-item">
              <Button>
                <NavLink className="nav-link" to="/">
                  Contact Us
                </NavLink>
              </Button>
            </ListItem>
          </Flex>
        </List>

        {!user.user_id && (
          <List>
            <Flex>
              <ListItem className="nav-item">
                <Button>
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </Button>
              </ListItem>
              <ListItem className="nav-item">
                <Button>
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </Button>
              </ListItem>
            </Flex>
          </List>
        )}
        {user.user_id && (
          <List>
            <Flex>
              <ListItem className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  {user.first_name} {user.last_name}
                </NavLink>
              </ListItem>
              <ListItem className="nav-item">
                <Button>
                  <NavLink className="nav-link" to="/logout">
                    Logout
                  </NavLink>
                </Button>
              </ListItem>
            </Flex>
          </List>
        )}
      </HStack>
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
