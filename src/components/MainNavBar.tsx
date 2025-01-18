import {
  Avatar,
  Button,
  Flex,
  Heading,
  Image,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  IconButton,
  Text,
  Box,
} from "@chakra-ui/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/songBankLogo.png";
import ColorModeSwitch from "./ColorModeSwitch";
import CurrentUser from "../entities/CurrentUser";
import { HamburgerIcon } from "@chakra-ui/icons";

interface Props {
  user: CurrentUser | null;
}

const MainNavBar = ({ user }: Props) => {
  const ListOfActions = [
    { value: "users/" + user?._id, label: "User Profile" },
    { value: "/change_password/", label: "Change Password" },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenRef");
    navigate("/logout");
    navigate(0);
  };

  const NavLinks = () => (
    <List>
      <Flex direction={{ base: "column", md: "row" }} gap={2}>
        <ListItem>
          <Button color={"cyan.400"} width="100%">
            <NavLink to="/upload">Upload Song</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button color={"cyan.400"} width="100%">
            <NavLink to="/contact">Contact Us</NavLink>
          </Button>
        </ListItem>
        {(user?.role === "admin" || user?.role === "superAdmin") && (
          <ListItem>
            <Button color={"cyan.400"} width="100%">
              <NavLink to="/admin">Admin Panel</NavLink>
            </Button>
          </ListItem>
        )}
      </Flex>
    </List>
  );

  const AuthButtons = () => (
    <List>
      <Flex direction={{ base: "column", md: "row" }} gap={2}>
        <ListItem>
          <Button width="100%">
            <NavLink to="/auth">Login</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button width="100%">
            <NavLink to="/register">Register</NavLink>
          </Button>
        </ListItem>
      </Flex>
    </List>
  );

  return (
    <Flex
      padding="10px"
      wrap="wrap"
      alignItems="center"
      justifyContent="space-between"
      gap={2}
    >
      {/* Logo and Title Section */}
      <Flex alignItems="center" marginRight={4}>
        <Link to="/songs/">
          <Image src={logo} boxSize="60px" marginRight={2} />
        </Link>
        <Show above="sm">
          <Link to="/songs/">
            <Text as="b" color="brown" fontSize={{ base: "2xl", md: "4xl" }}>
              SheetMusicLibrary
            </Text>
          </Link>
        </Show>
      </Flex>

      {/* Navigation Section */}
      <Show above="md">
        <NavLinks />
      </Show>

      {/* User Section and Mobile Menu */}
      <Flex alignItems="center" gap={4} flex={1} justifyContent="flex-end">
        {/* Mobile Menu */}
        <Show below="md">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
            />
            <MenuList>
              <NavLinks />
              {!user?._id && <AuthButtons />}
            </MenuList>
          </Menu>
        </Show>

        {/* Desktop Auth/User Section */}
        <Show above="md">{!user?._id && <AuthButtons />}</Show>

        {user?._id && (
          <Flex alignItems="center" gap={2}>
            <Show above="md">
              <Heading as="h2" size={{ base: "sm", lg: "lg" }}>
                Welcome: {user.name}
              </Heading>
            </Show>
            <Menu>
              <MenuButton>
                <Avatar name={user.name} size={{ base: "sm", md: "md" }} />
              </MenuButton>
              <MenuList>
                {ListOfActions.map((action) => (
                  <MenuItem key={action.value}>
                    <NavLink to={action.value}>{action.label}</NavLink>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>
                  <Text>Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}

        {/* ColorModeSwitch in its own container */}
        <Box marginLeft="auto">
          <ColorModeSwitch />
        </Box>
      </Flex>
    </Flex>
  );
};

export default MainNavBar;
