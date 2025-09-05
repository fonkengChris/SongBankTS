import { Button, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useLanguages from "../hooks/useLanguages";
import { useEffect } from "react";

const LanguageSelector = () => {
  const { data: languages, error } = useLanguages();
  const selectedLanguageId = useSongQueryStore((s) => s.songQuery.languageId);
  const selectedLanguage = languages?.find((n) => n._id === selectedLanguageId);

  const setSelectedLanguage = useSongQueryStore((s) => s.setLanguageId);

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
          {selectedLanguage?.name || "Language"}
        </Text>
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg={menuBg}
        borderColor={menuBorderColor}
      >
        <MenuItem
          onClick={() => setSelectedLanguage(null)}
          _hover={{ bg: menuItemHoverBg }}
          color={buttonTextColor}
          fontWeight="500"
        >
          All Languages
        </MenuItem>
        {languages?.map((language) => (
          <MenuItem
            onClick={() => setSelectedLanguage(language._id)}
            key={language._id}
            _hover={{ bg: "gray.700" }}
            color="cyan.300"
            fontWeight="500"
          >
            {language.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector;
