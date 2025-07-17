import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Divider,
} from "@chakra-ui/react";

const Footer = () => {
  const footerBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400");
  const linkColor = useColorModeValue("gray.600", "gray.400");
  const linkHoverColor = useColorModeValue("gray.800", "gray.200");

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
            <Link
              href={"/"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              Home
            </Link>
            <Link
              href={"/contact"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              Contact
            </Link>
            <Link
              href={"/upload"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              Upload
            </Link>
            <Link
              href={"/about"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              About
            </Link>
            <Link
              href={"/songs"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              Songs
            </Link>
            <Link
              href={"/auth"}
              color={linkColor}
              _hover={{
                color: linkHoverColor,
                textDecoration: "none",
                transform: "translateY(-1px)",
              }}
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.01em"
              transition="all 0.2s ease"
            >
              Login
            </Link>
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
              <Link
                href={"/terms"}
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
              >
                Terms of Service
              </Link>
              <Link
                href={"/privacy"}
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
              >
                Privacy Policy
              </Link>
              <Link
                href={"/copyright"}
                color={linkColor}
                _hover={{
                  color: linkHoverColor,
                  textDecoration: "none",
                  transform: "translateY(-1px)",
                }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="500"
                letterSpacing="0.01em"
                transition="all 0.2s ease"
              >
                Copyright
              </Link>
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
