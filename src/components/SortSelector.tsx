import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";

const SortSelector = () => {
  const sortOrders = [
    { value: "", label: "Relevance" },
    { value: "-lastUpdate", label: "Latest Update" },
    { value: "title", label: "Title" },
    { value: "-metacritic", label: "Popularity" },
  ];

  const sortOrder = useSongQueryStore((s) => s.songQuery.sortOrder);
  const currentSortOrder = sortOrders.find(
    (order) => order.value === sortOrder
  );

  const setSortOrder = useSongQueryStore((s) => s.setSortOrder);

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
        Order by: {currentSortOrder?.label || "Relevance"}
      </MenuButton>
      <MenuList maxHeight="300px" overflow="auto">
        {sortOrders.map((order) => (
          <MenuItem
            onClick={() => setSortOrder(order.value)}
            key={order.value}
            value={order.value}
          >
            {order.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
