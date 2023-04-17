import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/songBankLogo.png";
import ColorModeSwitch from "./ColorModeSwitch";

const NavBar = () => {
  return (
    <HStack justifyContent="space-between" padding="10px">
      <Flex>
        <Image src={logo} boxSize="60px" />
        <Text as="b" color="brown" fontSize="4xl">
          SongBank
        </Text>
      </Flex>
      <ColorModeSwitch />
    </HStack>
  );
};

export default NavBar;
