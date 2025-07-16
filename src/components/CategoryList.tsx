import {
  Button,
  Heading,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
  VStack,
  Box,
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
    <VStack spacing={4} align="stretch" p={{ base: 3, md: 4 }}>
      <Heading 
        marginY={3} 
        fontSize={{ base: "xl", md: "2xl" }} 
        textAlign="left"
        color="gray.800"
      >
        Categories
      </Heading>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Tbody>
            <Tr>
              <Td p={{ base: 2, md: 3 }}>
                <Button
                  whiteSpace="normal"
                  textAlign="left"
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight={"normal"}
                  onClick={() => setSelectedCategory(null)}
                  variant="link"
                  color={selectedCategoryId === null ? "blue.600" : "gray.600"}
                  _hover={{ color: "blue.800" }}
                  width="100%"
                  justifyContent="flex-start"
                >
                  All Categories
                </Button>
              </Td>
            </Tr>
            {categories?.map((category) => (
              <Tr key={category._id} paddingY="5px">
                <Td p={{ base: 2, md: 3 }}>
                  <Button
                    whiteSpace="normal"
                    textAlign="left"
                    fontSize={category._id === selectedCategoryId ? { base: "lg", md: "xl" } : { base: "md", md: "lg" }}
                    fontWeight={
                      category._id === selectedCategoryId ? "bold" : "normal"
                    }
                    onClick={() => setSelectedCategory(category._id)}
                    variant="link"
                    color={category._id === selectedCategoryId ? "blue.600" : "gray.600"}
                    _hover={{ color: "blue.800" }}
                    width="100%"
                    justifyContent="flex-start"
                  >
                    {category.title}
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default CategoryList;
