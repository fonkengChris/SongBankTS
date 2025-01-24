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
        minH="50px"
        height="50px"
        display="inline-flex"
        alignItems="center"
        width="auto"
      >
        {selectedCategory?.title || "Categories"}
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => setSelectedCategory(null)}>
          All Categories
        </MenuItem>
        {categories?.map((category) => (
          <MenuItem
            onClick={() => setSelectedCategory(category._id)}
            key={category._id}
          >
            {category.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default CategorySelector;
