import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { BsChevronDown } from "react-icons/bs";
import useNotations from "../hooks/useNotations";
import { Notation } from "../hooks/useNotations";

interface Props {
  onSelectNotation: (notation: Notation | null) => void;
  selectedNotationId?: number;
}

const NotationSelector = ({ onSelectNotation, selectedNotationId }: Props) => {
  const { data: notations, error } = useNotations();
  const selectedNotation = notations.find((n) => n.id === selectedNotationId);

  if (error) return null;
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedNotation?.title || "Notations"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => onSelectNotation(null)}>
          All Notations
        </MenuItem>
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
