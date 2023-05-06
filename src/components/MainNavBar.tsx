import {
  Avatar,
  Button,
  Flex,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/songBankLogo.png";
import ColorModeSwitch from "./ColorModeSwitch";

interface Props {
  user: CurrentUser | null;
}

const MainNavBar = ({ user }: Props) => {
  const ListOfActions = [
    { value: "users/" + user?.user_id, label: "User Profile" },
    { value: "/change_password/", label: "Change Password" },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenRef");

    navigate("/logout");
    navigate(0);
  };

  const fullname = `${user?.first_name} ${user?.last_name}`;
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Flex>
        <Link to="/songs/">
          <Image src={logo} boxSize="60px" />
        </Link>
        <Link to="/songs/">
          <Text as="b" color="brown" fontSize="4xl" marginRight={3}>
            SongBank
          </Text>
        </Link>

        <List className="navbar-nav">
          <Flex>
            <ListItem className="nav-item" marginRight={3}>
              <Button color={"cyan.400"}>
                <NavLink className="nav-link" to="/">
                  About Us
                </NavLink>
              </Button>
            </ListItem>
            <ListItem className="nav-item" marginRight={3}>
              <Button color={"cyan.400"}>
                <NavLink className="nav-link" to="/">
                  Contact Us
                </NavLink>
              </Button>
            </ListItem>
          </Flex>
        </List>
      </Flex>

      <HStack justifyContent="space-between" padding={2}>
        {!user?.user_id && (
          <List>
            <Flex>
              <ListItem className="nav-item" marginRight={3}>
                <Button>
                  <NavLink className="nav-link" to="/login">
                    Login
                  </NavLink>
                </Button>
              </ListItem>
              <ListItem className="nav-item" marginRight={3}>
                <Button>
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </Button>
              </ListItem>
            </Flex>
          </List>
        )}
        {user?.user_id && (
          <List>
            <Flex>
              <Heading as="h3" paddingRight={5}>
                Welcome: {fullname}
              </Heading>
              <Menu>
                <MenuButton>
                  <Wrap>
                    <WrapItem>
                      <Avatar name={fullname} />
                    </WrapItem>{" "}
                  </Wrap>
                </MenuButton>
                <MenuList>
                  {ListOfActions.map((action) => (
                    <MenuItem key={action.value}>
                      <NavLink to={action.value}>{action.label}</NavLink>
                    </MenuItem>
                  ))}
                  <MenuItem onClick={() => handleLogout()} marginRight={3}>
                    <Text>Logout</Text>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </List>
        )}
        <ColorModeSwitch />
      </HStack>
    </HStack>
  );
};

export default MainNavBar;
