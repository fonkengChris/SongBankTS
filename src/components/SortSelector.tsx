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
        Order by: {currentSortOrder?.label || "Relevance"}
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg="gray.800"
        borderColor="gray.600"
      >
        {sortOrders.map((order) => (
          <MenuItem
            onClick={() => setSortOrder(order.value)}
            key={order.value}
            value={order.value}
            _hover={{ bg: "gray.700" }}
            color="gray.300"
            fontWeight="500"
          >
            {order.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default SortSelector;
