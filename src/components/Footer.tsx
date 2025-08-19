import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Button,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Footer = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const footerBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.300");
  // Force dark colors with !important for better visibility in light mode
  const linkColor = useColorModeValue("gray.900", "gray.200");
  const linkHoverColor = useColorModeValue("blue.700", "blue.300");

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      bg={footerBg}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={borderColor}
      mt="auto"
      py={8}
    >
      <Container maxW={"6xl"} py={{ base: 8, md: 12 }}>
        <Stack spacing={{ base: 8, md: 12 }}>
          {/* Navigation Links */}
          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 6 }}
            spacing={{ base: 6, md: 8 }}
            justifyItems={{ base: "center", md: "center" }}
          >
            <Button
              onClick={() => handleNavigation("/")}
              variant="ghost"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
                bg: "transparent",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              bg="transparent"
              p={0}
              minW="auto"
              h="auto"
            >
              Home
            </Button>
            <Button
              onClick={() => handleNavigation("/contact")}
              variant="ghost"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
                bg: "transparent",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              bg="transparent"
              p={0}
              minW="auto"
              h="auto"
            >
              Contact
            </Button>
            <Button
              onClick={() => handleNavigation("/upload")}
              variant="ghost"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
                bg: "transparent",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              bg="transparent"
              p={0}
              minW="auto"
              h="auto"
            >
              Upload
            </Button>
            <Button
              onClick={() => handleNavigation("/about")}
              variant="ghost"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
                bg: "transparent",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              bg="transparent"
              p={0}
              minW="auto"
              h="auto"
            >
              About
            </Button>
            <Button
              onClick={() => handleNavigation("/songs")}
              variant="ghost"
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
                bg: "transparent",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
              bg="transparent"
              p={0}
              minW="auto"
              h="auto"
            >
              Songs
            </Button>
            {!isAuthenticated ? (
              <Button
                onClick={() => handleNavigation("/auth")}
                variant="ghost"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                  bg: "transparent",
                }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
                bg="transparent"
                p={0}
                minW="auto"
                h="auto"
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={handleLogout}
                variant="ghost"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                  bg: "transparent",
                }}
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
                bg="transparent"
                p={0}
                minW="auto"
                h="auto"
              >
                Logout
              </Button>
            )}
          </SimpleGrid>

          <Divider borderColor={borderColor} />

          {/* Copyright and Additional Links */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "center", md: "center" }}
            gap={{ base: 4, md: 0 }}
          >
            <Text
              color={textColor}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="500"
              letterSpacing="0.01em"
              textAlign={{ base: "center", md: "left" }}
            >
              © 2024 SheetMusicLibrary. All rights reserved.
            </Text>
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={{ base: 2, sm: 6 }}
              mt={{ base: 4, md: 0 }}
            >
              <Button
                onClick={() => handleNavigation("/terms")}
                variant="ghost"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                  bg: "transparent",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
                bg="transparent"
                p={0}
                minW="auto"
                h="auto"
              >
                Terms of Service
              </Button>
              <Button
                onClick={() => handleNavigation("/privacy")}
                variant="ghost"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                  bg: "transparent",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
                bg="transparent"
                p={0}
                minW="auto"
                h="auto"
              >
                Privacy Policy
              </Button>
              <Button
                onClick={() => handleNavigation("/copyright")}
                variant="ghost"
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                  bg: "transparent",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
                bg="transparent"
                p={0}
                minW="auto"
                h="auto"
              >
                Copyright
              </Button>
            </Flex>
          </Flex>

          {/* Additional Info */}
          <Text
            color={textColor}
            fontSize="sm"
            fontWeight="400"
            textAlign="center"
            letterSpacing="0.01em"
            opacity={0.8}
          >
            Made with ❤️ for musicians worldwide
          </Text>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
