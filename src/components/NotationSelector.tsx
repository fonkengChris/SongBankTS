import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useNotations from "../hooks/useNotations";

const NotationSelector = () => {
  const { data: notations, error } = useNotations();
  const selectedNotationId = useSongQueryStore((s) => s.songQuery.notationId);
  const setSelectedNotation = useSongQueryStore((s) => s.setNotationId);

  const selectedNotation = notations?.find((n) => n._id === selectedNotationId);

  // Theme-aware colors
  const buttonBg = useColorModeValue("white", "gray.700");
  const buttonBorderColor = useColorModeValue("gray.300", "gray.600");
  const buttonTextColor = useColorModeValue("blue.600", "cyan.300");
  const buttonHoverBg = useColorModeValue("gray.50", "gray.600");
  const buttonHoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const buttonActiveBg = useColorModeValue("gray.100", "gray.500");
  const menuBg = useColorModeValue("white", "gray.800");
  const menuBorderColor = useColorModeValue("gray.200", "gray.600");
  const menuItemHoverBg = useColorModeValue("gray.50", "gray.700");

  if (error) return null;

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<BsChevronDown />}
        minH={{ base: "48px", md: "56px" }}
        height={{ base: "48px", md: "56px" }}
        display="inline-flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        fontSize={{ base: "sm", md: "md", lg: "lg" }}
        fontWeight="500"
        letterSpacing="0.01em"
        variant="outline"
        borderColor={buttonBorderColor}
        color={buttonTextColor}
        bg={buttonBg}
        _hover={{
          bg: buttonHoverBg,
          borderColor: buttonHoverBorderColor,
          transform: "translateY(-1px)",
        }}
        _active={{
          bg: buttonActiveBg,
          borderColor: "blue.400",
        }}
        transition="all 0.2s ease"
        overflow="hidden"
      >
        <Text
          noOfLines={1}
          textAlign="left"
          flex={1}
          minWidth={0}
        >
          {selectedNotation?.title || "Notations"}
        </Text>
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg={menuBg}
        borderColor={menuBorderColor}
      >
        <MenuItem
          onClick={() => setSelectedNotation(null)}
          _hover={{ bg: menuItemHoverBg }}
          color={buttonTextColor}
          fontWeight="500"
        >
          All Notations
        </MenuItem>
        {notations?.map((notation) => (
          <MenuItem
            onClick={() => {
              setSelectedNotation(notation._id);
            }}
            key={notation._id}
            _hover={{ bg: "gray.700" }}
            color="cyan.300"
            fontWeight="500"
          >
            {notation.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NotationSelector;
