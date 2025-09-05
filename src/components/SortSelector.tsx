import { Button, Menu, MenuButton, MenuItem, MenuList, Text, Show, useColorModeValue } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";

const SortSelector = () => {
  const sortOrders = [
    { value: "", label: "Relevance" },
    { value: "-trendingScore", label: "Trending" },
    { value: "-lastUpdate", label: "Latest Update" },
    { value: "title", label: "Title" },
    { value: "-metacritic", label: "Popularity" },
  ];

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
        minH={{ base: "40px", md: "48px" }}
        height={{ base: "40px", md: "48px" }}
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
          <Show above="md">Order by: </Show>
          {currentSortOrder?.label || "Relevance"}
        </Text>
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg={menuBg}
        borderColor={menuBorderColor}
      >
        {sortOrders.map((order) => (
          <MenuItem
            onClick={() => setSortOrder(order.value)}
            key={order.value}
            value={order.value}
            _hover={{ bg: menuItemHoverBg }}
            color={buttonTextColor}
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
