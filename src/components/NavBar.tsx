import { HStack, Image, Text } from "@chakra-ui/react";
import logo from "../assets/songBankLogo.png";

const NavBar = () => {
  return (
    <HStack>
      <Image src={logo} boxSize="60px" />
      <Text as="b" color="brown" fontSize="4xl">
        SongBank
      </Text>
    </HStack>
  );
};

export default NavBar;
