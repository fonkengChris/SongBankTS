import {
  Button,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import useCategories, { Category } from "../hooks/useCategories";
import useData from "../hooks/useData";

interface Props {
  onSelectCategory: (category: Category) => void;
  selectedCategory: Category | null;
}

const CategoryList = ({ onSelectCategory, selectedCategory }: Props) => {
  const {
    data: categories,
    isLoading,
    error,
  } = useData<Category>("/categories");

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
            {categories.map((category) => (
              <Tr key={category.id} paddingY="5px">
                <Td>
                  <Button
                    whiteSpace="normal"
                    textAlign="left"
                    fontSize="lg"
                    fontWeight={
                      category.id === selectedCategory?.id ? "bold" : "normal"
                    }
                    onClick={() => onSelectCategory(category)}
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
