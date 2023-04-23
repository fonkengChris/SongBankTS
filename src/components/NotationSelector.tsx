import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import useNotations from "../hooks/useNotations";
import { Notation } from "../hooks/useSongs";

interface Props {
  onSelectNotation: (notation: Notation) => void;
  selectedNotation: Notation | null;
}

const NotationSelector = ({ onSelectNotation, selectedNotation }: Props) => {
  const { data: notations, error } = useNotations();

  if (error) return null;
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedNotation?.title || "Notations"}
      </MenuButton>
      <MenuList>
        {notations?.map((notation) => (
          <MenuItem
            onClick={() => onSelectNotation(notation)}
            key={notation.id}
          >
            {notation.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NotationSelector;
