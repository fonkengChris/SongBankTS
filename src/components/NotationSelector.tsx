import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useNotations from "../hooks/useNotations";
import { useEffect } from "react";

const NotationSelector = () => {
  const { data: notations, error } = useNotations();
  const selectedNotationId = useSongQueryStore((s) => s.songQuery.notationId);
  const setSelectedNotation = useSongQueryStore((s) => s.setNotationId);

  const selectedNotation = notations?.find((n) => n._id === selectedNotationId);

  if (error) return null;

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<BsChevronDown />}>
        {selectedNotation?.title || "Notations"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setSelectedNotation(null)}>
          All Notations
        </MenuItem>
        {notations?.map((notation) => (
          <MenuItem
            onClick={() => {
              setSelectedNotation(notation._id);
            }}
            key={notation._id}
          >
            {notation.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NotationSelector;
