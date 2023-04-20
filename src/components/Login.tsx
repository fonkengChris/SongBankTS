import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
} from "@chakra-ui/react";
import { Form } from "formik";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";

const Login = () => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        // if (ref.current) onSearch(ref.current.value);
      }}
    >
      <Stack spacing={6}>
        <InputGroup>
          <Input
            isInvalid
            errorBorderColor="crimson"
            focusBorderColor="teal.400"
            borderRadius={20}
            placeholder="Enter Email address ..."
            variant="filled"
          />
        </InputGroup>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button colorScheme="teal" variant="solid">
          Submit
        </Button>
      </Stack>
    </form>
  );
};

export default Login;
