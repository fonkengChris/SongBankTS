import {
  Button,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import useSongQueryStore from "../Store";
import useCategories from "../hooks/useCategories";

const CategoryList = () => {
  const { data: categories, isLoading, error } = useCategories();
  const selectedCategoryId = useSongQueryStore((s) => s.songQuery.categoryId);
  const setSelectedCategory = useSongQueryStore((s) => s.setCategoryId);

  if (error) return null;

  if (isLoading) return <Spinner />;

  return (
    <>
      <Heading marginY={3} fontSize="2xl" textAlign="left">
        Categories
      </Heading>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Tbody>
            <Tr>
              <Td>
                <Button
                  whiteSpace="normal"
                  textAlign="left"
                  fontSize="lg"
                  fontWeight={"normal"}
                  onClick={() => setSelectedCategory(null)}
                  variant="link"
                >
                  All Categories
                </Button>
              </Td>
            </Tr>
            {categories?.map((category) => (
              <Tr key={category.id} paddingY="5px">
                <Td>
                  <Button
                    whiteSpace="normal"
                    textAlign="left"
                    fontSize={category.id === selectedCategoryId ? "xl" : "lg"}
                    fontWeight={
                      category.id === selectedCategoryId ? "bold" : "normal"
                    }
                    onClick={() => setSelectedCategory(category.id)}
                    variant="link"
                  >
                    {category.title}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoryList;
