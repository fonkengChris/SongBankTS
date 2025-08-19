import { HStack, Switch, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const textColor = useColorModeValue("gray.800", "white");
  
  return (
    <HStack>
      <Switch
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <Text whiteSpace="nowrap" color={textColor}>
        {colorMode === "dark" ? "Dark Mode" : "Light Mode"}
      </Text>
    </HStack>
  );
};

export default ColorModeSwitch;
