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
import useCategories, { Category } from "../hooks/useCategories";

interface Props {
  onSelectCategory: (category: Category | null) => void;
  selectedCategoryId?: number;
}

const CategoryList = ({ onSelectCategory, selectedCategoryId }: Props) => {
  const { data: categories, isLoading, error } = useCategories();

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
                  onClick={() => onSelectCategory(null)}
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
