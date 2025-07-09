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
        <InputLeftElement children={<BsSearch />} />
        <Input
          ref={ref}
          borderRadius={20}
          placeholder="Search songs ..."
          variant="filled"
          height="50px"
          minH="50px"
          defaultValue={searchText || ""}
        />
      </InputGroup>
    </form>
  );
};

export default SearchInput;
