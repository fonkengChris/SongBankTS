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
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/songBankLogo.png";
import CurrentUser from "../entities/CurrentUser";
import { HamburgerIcon } from "@chakra-ui/icons";
import useAuth from "../hooks/useAuth";

interface Props {
  user: CurrentUser | null;
}

const MainNavBar = ({ user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Theme-aware colors
  const navBg = useColorModeValue("white", "gray.900");
  const navBorderColor = useColorModeValue("gray.200", "gray.700");
  const buttonColor = useColorModeValue("gray.700", "gray.300");
  const buttonHoverBg = useColorModeValue("blue.50", "blue.500");
  const buttonHoverColor = useColorModeValue("blue.700", "white");

  const ListOfActions = [
    { value: "users/" + user?._id, label: "User Profile" },
    { value: "/settings", label: "Settings" },
  ];

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  const handleNavigation = (path: string) => {
    onClose(); // Close the mobile menu
    navigate(path);
  };

  const NavLinks = () => (
    <List>
      <Flex direction={{ base: "column", md: "row" }} gap={3}>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/")}
          >
            Home
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/songs")}
          >
            Songs
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/tutorials")}
          >
            Tutorials
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/blog")}
          >
            Blog
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/about")}
          >
            About
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/contact")}
          >
            Contact
          </Button>
        </ListItem>
        <ListItem>
          <Button
            colorScheme="blue"
            variant="ghost"
            color={buttonColor}
            _hover={{
              bg: buttonHoverBg,
              color: buttonHoverColor,
              transform: "translateY(-1px)",
            }}
            _active={{ bg: "blue.600" }}
            fontWeight="600"
            fontSize="md"
            letterSpacing="0.01em"
            transition="all 0.2s ease"
            width="100%"
            onClick={() => handleNavigation("/upload")}
          >
            Upload
          </Button>
        </ListItem>
        {(user?.role === "admin" || user?.role === "superAdmin") && (
          <ListItem>
            <Button
              colorScheme="purple"
              variant="ghost"
              color={buttonColor}
              _hover={{
                bg: "purple.100",
                color: "purple.700",
                transform: "translateY(-1px)",
              }}
              _active={{ bg: "purple.600" }}
              fontWeight="600"
              fontSize="md"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              width="100%"
              onClick={() => handleNavigation("/admin")}
            >
              Admin
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
            onClick={() => handleNavigation("/auth")}
          >
            Login
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
            onClick={() => handleNavigation("/register")}
          >
            Register
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
      bg={navBg}
      borderBottom="1px solid"
      borderColor={navBorderColor}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)"
    >
      {/* Logo and Title Section */}
      <Flex alignItems="center" marginRight={6}>
        <Link to="/songs/">
          <Image
            src={logo}
            boxSize="100px"
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
          <Menu isOpen={isOpen} onClose={onClose}>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="outline"
              borderColor={useColorModeValue("gray.300", "gray.600")}
              color={buttonColor}
              _hover={{
                bg: useColorModeValue("gray.100", "gray.700"),
                borderColor: useColorModeValue("gray.400", "gray.500"),
              }}
              onClick={onOpen}
            />
            <MenuList bg={useColorModeValue("white", "gray.800")} borderColor={useColorModeValue("gray.200", "gray.600")}>
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
                color={buttonColor}
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
                          <MenuList bg={useColorModeValue("white", "gray.800")} borderColor={useColorModeValue("gray.200", "gray.600")}>
              {ListOfActions.map((action) => (
                <MenuItem
                  key={action.value}
                  _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                  color={buttonColor}
                  fontWeight="500"
                  onClick={() => handleNavigation(action.value)}
                >
                  {action.label}
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
