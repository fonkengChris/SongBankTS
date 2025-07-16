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
    >
      <Container maxW={"6xl"} py={{ base: 6, md: 8 }}>
        <Stack spacing={{ base: 6, md: 8 }}>
          {/* Navigation Links */}
          <SimpleGrid
            columns={{ base: 2, sm: 3, md: 6 }}
            spacing={{ base: 4, md: 6 }}
            justifyItems={{ base: "center", md: "center" }}
          >
            <Link
              href={"/"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              Home
            </Link>
            <Link
              href={"/contact"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              Contact
            </Link>
            <Link
              href={"/upload"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              Upload
            </Link>
            <Link
              href={"/about"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              About
            </Link>
            <Link
              href={"/privacy"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              Privacy
            </Link>
            <Link
              href={"/copyright"}
              color={linkColor}
              _hover={{ color: linkHoverColor, textDecoration: "none" }}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="medium"
              transition="color 0.2s"
            >
              Copyright
            </Link>
          </SimpleGrid>

          {/* Divider */}
          <Divider borderColor={borderColor} />

          {/* Copyright Text */}
          <Flex 
            justify="center" 
            align="center"
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 2, sm: 4 }}
            textAlign={{ base: "center", sm: "center" }}
          >
            <Text
              color={textColor}
              fontSize={{ base: "xs", sm: "sm", md: "md" }}
              fontWeight="medium"
            >
              © {new Date().getFullYear()} SheetMusicLibrary
            </Text>
            <Text
              color={textColor}
              fontSize={{ base: "xs", sm: "sm", md: "md" }}
              fontWeight="medium"
              display={{ base: "none", sm: "block" }}
              mx={2}
            >
              •
            </Text>
            <Text
              color={textColor}
              fontSize={{ base: "xs", sm: "sm", md: "md" }}
              fontWeight="medium"
            >
              All rights reserved
            </Text>
          </Flex>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
