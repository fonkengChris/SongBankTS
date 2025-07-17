import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useLanguages from "../hooks/useLanguages";
import { useEffect } from "react";

const LanguageSelector = () => {
  const { data: languages, error } = useLanguages();
  const selectedLanguageId = useSongQueryStore((s) => s.songQuery.languageId);
  const selectedLanguage = languages?.find((n) => n._id === selectedLanguageId);

  const setSelectedLanguage = useSongQueryStore((s) => s.setLanguageId);

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
        width="100%"
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="500"
        letterSpacing="0.01em"
        variant="outline"
        borderColor="gray.600"
        color="gray.300"
        bg="gray.700"
        _hover={{
          bg: "gray.600",
          borderColor: "gray.500",
          transform: "translateY(-1px)",
        }}
        _active={{
          bg: "gray.500",
          borderColor: "blue.400",
        }}
        transition="all 0.2s ease"
      >
        {selectedLanguage?.name || "Language"}
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg="gray.800"
        borderColor="gray.600"
      >
        <MenuItem
          onClick={() => setSelectedLanguage(null)}
          _hover={{ bg: "gray.700" }}
          color="gray.300"
          fontWeight="500"
        >
          All Languages
        </MenuItem>
        {languages?.map((language) => (
          <MenuItem
            onClick={() => setSelectedLanguage(language._id)}
            key={language._id}
            _hover={{ bg: "gray.700" }}
            color="gray.300"
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
