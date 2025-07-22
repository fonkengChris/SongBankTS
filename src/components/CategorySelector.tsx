import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import useSongQueryStore from "../Store";
import useCategories from "../hooks/useCategories";

const CategorySelector = () => {
  const { data: categories, error } = useCategories();
  const selectedCategoryId = useSongQueryStore((s) => s.songQuery.categoryId);
  const setSelectedCategory = useSongQueryStore((s) => s.setCategoryId);

  const selectedCategory = categories?.find(
    (c) => c._id === selectedCategoryId
  );

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
        color="cyan.300"
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
        {selectedCategory?.title || "Categories"}
      </MenuButton>
      <MenuList
        maxHeight="300px"
        overflow="auto"
        bg="gray.800"
        borderColor="gray.600"
      >
        <MenuItem
          onClick={() => setSelectedCategory(null)}
          _hover={{ bg: "gray.700" }}
          color="cyan.300"
          fontWeight="500"
        >
          All Categories
        </MenuItem>
        {categories?.map((category) => (
          <MenuItem
            onClick={() => setSelectedCategory(category._id)}
            key={category._id}
            _hover={{ bg: "gray.700" }}
            color="cyan.300"
            fontWeight="500"
          >
            {category.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CategorySelector;
