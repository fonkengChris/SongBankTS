import {
  Button,
  HStack,
  Heading,
  Image,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import useGenres, { Category } from "../hooks/useCategories";
// import getCroppedImageUrl from "../services/image-urls";

// interface Props {
//   onSelectCategory: (category: Category) => void;
//   selectedCategory: Category | null;
// }

const CategoryList = () => {
  const { categories, isLoading, error } = useGenres();

  if (error) return null;

  if (isLoading) return <Spinner />;

  return (
    <>
      <Heading marginY={3} fontSize="2xl" textAlign="left">
        Genres
      </Heading>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id} paddingY="5px">
            <HStack>
              {/* <Image
                boxSize="32px"
                objectFit="cover"
                borderRadius={8}
                src={getCroppedImageUrl(genre.image_background)}
              /> */}
              <Button
                whiteSpace="normal"
                textAlign="left"
                fontSize="lg"
                fontWeight={
                  "bold"
                  // category.id === selectedCategory?.id ? "bold" : "normal"
                }
                // onClick={() => onSelectCategory(category)}
                variant="link"
              >
                {category.title}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CategoryList;
