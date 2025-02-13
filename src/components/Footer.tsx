import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";

const Footer = () => {
  const footerBg = useColorModeValue("gray.50", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={footerBg}
      borderTop={1}
      borderStyle={"solid"}
      borderColor={borderColor}
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        spacing={4}
        justify={"center"}
        align={"center"}
      >
        <Stack direction={"row"} spacing={6}>
          <Link href={"/songs"}>Home</Link>
          <Link href={"/contact"}>Contact</Link>
          <Link href={"/upload"}>Upload</Link>
          <Link href={"/about"}>About</Link>
          <Link href={"/privacy"}>Privacy</Link>
          <Link href={"/copyright"}>Copyright</Link>
        </Stack>
        <Text>
          © {new Date().getFullYear()} SheetMusicLibrary. All rights reserved
        </Text>
      </Container>
    </Box>
  );
};

export default Footer;
