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
        minH={{ base: "40px", md: "50px" }}
        height={{ base: "40px", md: "50px" }}
        display="inline-flex"
        alignItems="center"
        width="100%"
        fontSize={{ base: "sm", md: "md" }}
        variant="outline"
        _hover={{ bg: "gray.50" }}
        _active={{ bg: "gray.100" }}
      >
        {selectedLanguage?.name || "Language"}
      </MenuButton>
      <MenuList maxHeight="300px" overflow="auto">
        <MenuItem onClick={() => setSelectedLanguage(null)}>
          All Languages
        </MenuItem>
        {languages?.map((language) => (
          <MenuItem
            onClick={() => setSelectedLanguage(language._id)}
            key={language._id}
          >
            {language.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector;
