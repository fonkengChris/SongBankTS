import { Input, InputGroup, InputLeftElement, useColorModeValue } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import useSongQueryStore from "../Store";

const SearchInput = () => {
  const ref = useRef<HTMLInputElement>(null);
  const searchText = useSongQueryStore((s) => s.songQuery.searchText);
  const setSearchText = useSongQueryStore((s) => s.setSearchText);

  // Theme-aware colors
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const inputTextColor = useColorModeValue("gray.800", "white");
  const inputPlaceholderColor = useColorModeValue("gray.500", "gray.400");
  const inputFocusBg = useColorModeValue("gray.50", "gray.600");
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.400");
  const inputHoverBg = useColorModeValue("gray.50", "gray.600");
  const inputHoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const iconColor = useColorModeValue("gray.500", "gray.400");

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
          color={iconColor}
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
          bg={inputBg}
          border="1px solid"
          borderColor={inputBorderColor}
          color={inputTextColor}
          _placeholder={{ 
            color: inputPlaceholderColor,
            fontWeight: "400"
          }}
          _focus={{ 
            bg: inputFocusBg, 
            borderColor: inputFocusBorderColor,
            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)"
          }}
          _hover={{ 
            bg: inputHoverBg,
            borderColor: inputHoverBorderColor
          }}
          transition="all 0.2s ease"
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
