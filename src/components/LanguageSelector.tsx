import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useLanguages from "../hooks/useLanguages";

const LanguageSelector = () => {
  const { data: languages, error } = useLanguages();
  const selectedLanguageId = useSongQueryStore((s) => s.songQuery.languageId);
  const selectedLanguage = languages.find((n) => n._id === selectedLanguageId);

  const setSelectedLanguage = useSongQueryStore((s) => s.setLanguageId);

  if (error) return null;
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedLanguage?.name || "Language"}
      </MenuButton>
      <MenuList>
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
