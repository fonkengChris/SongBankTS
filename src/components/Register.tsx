import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { MdPhone } from "react-icons/md";
// import CountryDropdown from "country-dropdown-with-flags-for-react";
import ReactFlagsSelect from "react-flags-select";

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [value, setValue] = React.useState("");
  //   const handleChange = (event) => setValue(event.target.value);

  const [selected, setSelected] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        // if (ref.current) onSearch(ref.current.value);
      }}
    >
      <Stack spacing={4}>
        <InputGroup>
          <Text mb="6px">First Name {value}</Text>
          <Input
            isInvalid
            errorBorderColor="crimson"
            focusBorderColor="teal.400"
            //   onChange={handleChange}
            borderRadius={20}
            placeholder="Enter first name..."
            variant="filled"
          />
        </InputGroup>
        <InputGroup>
          <Text mb="6px">Last Name {value}</Text>
          <Input
            isInvalid
            errorBorderColor="crimson"
            focusBorderColor="teal.400"
            //   onChange={handleChange}
            borderRadius={20}
            placeholder="Enter last name..."
            variant="filled"
          />
        </InputGroup>

        <InputGroup>
          <Text mb="6px">Email Address {value}</Text>
          <Input
            isInvalid
            errorBorderColor="crimson"
            focusBorderColor="teal.400"
            //   onChange={handleChange}
            borderRadius={20}
            placeholder="Enter Email address ..."
            variant="filled"
          />
        </InputGroup>

        <InputGroup>
          <Text mb="6px">Membership Status {value}</Text>
          <Select placeholder="Membership status">
            <option value="G">G</option>
            <option value="S">S</option>
            <option value="B">B</option>
          </Select>
        </InputGroup>

        <InputGroup size="md">
          <Text mb="6px">Country {value}</Text>
          <ReactFlagsSelect
            selected={selected}
            onSelect={(code) => setSelected(code)}
          />
          ;
        </InputGroup>

        <InputGroup>
          <Text mb="6px">Phone Number {value}</Text>
          <InputLeftElement
            pointerEvents="none"
            children={<MdPhone color="gray.300" />}
          />
          <Input type="tel" placeholder="Phone number" />
        </InputGroup>

        <InputGroup size="md">
          <Text mb="6px">Date of birth {value}</Text>
          <Input placeholder="Date of birth" size="md" type="datetime-local" />
        </InputGroup>

        <InputGroup size="md">
          <Text mb="6px">Password {value}</Text>
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

        <InputGroup size="md">
          <Text mb="6px">Confirm Password {value}</Text>
          <Input
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Confirm password"
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

export default Register;
