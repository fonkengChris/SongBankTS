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

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  const NavLinks = () => (
    <List>
      <Flex direction={{ base: "column", md: "row" }} gap={3}>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color="gray.300"
            _hover={{
              bg: "blue.500",
              color: "white",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/">Home</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color="gray.300"
            _hover={{
              bg: "blue.500",
              color: "white",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/songs">Songs</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color="gray.300"
            _hover={{
              bg: "blue.500",
              color: "white",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/about">About</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color="gray.300"
            _hover={{
              bg: "blue.500",
              color: "white",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/contact">Contact</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color="gray.300"
            _hover={{
              bg: "blue.500",
              color: "white",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/upload">Upload</NavLink>
          </Button>
        </ListItem>
        {(user?.role === "admin" || user?.role === "superAdmin") && (
          <ListItem>
            <Button
              colorScheme="purple"
              variant="ghost"
              color="gray.300"
              _hover={{
                bg: "purple.500",
                color: "white",
                transform: "translateY(-1px)",
              }}
              _active={{ bg: "purple.600" }}
              fontWeight="600"
              fontSize="md"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              width="100%"
            >
              <NavLink to="/admin">Admin</NavLink>
            </Button>
          </ListItem>
        )}
      </Flex>
    </List>
  );

  const AuthButtons = () => (
    <List>
      <Flex direction={{ base: "column", md: "row" }} gap={3}>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="outline"
            borderColor="blue.400"
            color="blue.400"
            _hover={{
              bg: "blue.500",
              color: "white",
              borderColor: "blue.500",
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/auth">Login</NavLink>
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="green"
            variant="solid"
            bg="green.500"
            color="white"
            _hover={{
              bg: "green.600",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
            }}
            _active={{ bg: "green.700" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
          >
            <NavLink to="/register">Register</NavLink>
          </Button>
        </ListItem>
      </Flex>
    </List>
  );

  return (
    <Flex
      padding="16px"
      wrap="wrap"
      alignItems="center"
      justifyContent="space-between"
      gap={4}
      bg="gray.900"
      borderBottom="1px solid"
      borderColor="gray.700"
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
    >
      {/* Logo and Title Section */}
      <Flex alignItems="center" marginRight={6}>
        <Link to="/songs/">
          <Image
            src={logo}
            boxSize="60px"
            marginRight={3}
            transition="transform 0.2s ease"
            _hover={{ transform: "scale(1.05)" }}
          />
        </Link>
        <Show above="sm">
          <Link to="/songs/">
            <Text
              fontWeight="800"
              color="blue.400"
              fontSize={{ base: "2xl", md: "4xl" }}
              letterSpacing="-0.03em"
              textShadow="0 2px 4px rgba(0, 0, 0, 0.3)"
              transition="color 0.2s ease"
              _hover={{ color: "blue.300" }}
            >
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
              borderColor="gray.600"
              color="gray.300"
              _hover={{
                bg: "gray.700",
                borderColor: "gray.500",
              }}
            />
            <MenuList bg="gray.800" borderColor="gray.600">
              <NavLinks />
              {!user?._id && <AuthButtons />}
            </MenuList>
          </Menu>
        </Show>

        {/* Desktop Auth/User Section */}
        <Show above="md">{!user?._id && <AuthButtons />}</Show>

        {user?._id && (
          <Flex alignItems="center" gap={3}>
            <Show above="md">
              <Heading
                as="h2"
                size={{ base: "sm", lg: "md" }}
                fontWeight="600"
                color="gray.300"
                letterSpacing="0.01em"
              >
                Welcome: {getFirstName(user.name)}
              </Heading>
            </Show>
            <Menu>
              <MenuButton>
                <Avatar
                  name={user.name}
                  size={{ base: "sm", md: "md" }}
                  bg="blue.500"
                  color="white"
                  fontWeight="600"
                  transition="transform 0.2s ease"
                  _hover={{ transform: "scale(1.05)" }}
                />
              </MenuButton>
              <MenuList bg="gray.800" borderColor="gray.600">
                {ListOfActions.map((action) => (
                  <MenuItem
                    key={action.value}
                    _hover={{ bg: "gray.700" }}
                    color="gray.300"
                    fontWeight="500"
                  >
                    <NavLink to={action.value}>{action.label}</NavLink>
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  _hover={{ bg: "red.600" }}
                  color="red.400"
                  fontWeight="500"
                >
                  <Text>Logout</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default MainNavBar;
