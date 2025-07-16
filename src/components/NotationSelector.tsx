import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useNotations from "../hooks/useNotations";

const NotationSelector = () => {
  const { data: notations, error } = useNotations();
  const selectedNotationId = useSongQueryStore((s) => s.songQuery.notationId);
  const setSelectedNotation = useSongQueryStore((s) => s.setNotationId);

  const selectedNotation = notations?.find((n) => n._id === selectedNotationId);

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
        {selectedNotation?.title || "Notations"}
      </MenuButton>
      <MenuList maxHeight="300px" overflow="auto">
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
