import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import useSongQueryStore from "../Store";

const SearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const searchText = useSongQueryStore((s) => s.songQuery.searchText);
  const setSearchText = useSongQueryStore((s) => s.setSearchText);

  // Update input value when searchText changes
  useEffect(() => {
    if (ref.current && searchText !== undefined) {
      ref.current.value = searchText || "";
    }
  }, [searchText]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (ref.current) setSearchText(ref.current.value);
      }}
    >
      <InputGroup>
        <InputLeftElement
          children={<BsSearch />}
          height={{ base: "48px", md: "56px" }}
          color="gray.400"
        />
        <Input
          ref={ref}
          borderRadius="full"
          placeholder="Search songs..."
          variant="filled"
          height={{ base: "48px", md: "56px" }}
          minH={{ base: "48px", md: "56px" }}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="400"
          letterSpacing="0.01em"
          defaultValue={searchText || ""}
          bg="gray.700"
          border="1px solid"
          borderColor="gray.600"
          color="white"
          _placeholder={{ 
            color: "gray.400",
            fontWeight: "400"
          }}
          _focus={{ 
            bg: "gray.600", 
            borderColor: "blue.400",
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
          }}
          _hover={{ 
            bg: "gray.600",
            borderColor: "gray.500"
          }}
          transition="all 0.2s ease"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
