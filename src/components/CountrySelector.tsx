import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Input,
  Box,
} from "@chakra-ui/react";
import { BsChevronDown } from "react-icons/bs";
import { useState } from "react";
import { useCountries } from "../hooks/useCountries";

interface Props {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
  onPhoneChange?: (formattedNumber: string) => void;
  phone?: string;
}

const CountrySelector = ({
  selectedCountry,
  onSelect,
  onPhoneChange,
  phone,
}: Props) => {
  const { countries, setFilter } = useCountries();
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountryData = countries.find((c) => c.iso === selectedCountry);

  const handleCountrySelect = (countryIso: string) => {
    onSelect(countryIso);

    // If phone number exists, format it with new country code
    if (phone && onPhoneChange) {
      const country = countries.find((c) => c.iso === countryIso);
      if (country) {
        const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
        const withoutOldCode = cleanPhone.replace(/^(\d{1,4})/, ""); // Remove old country code if exists
        onPhoneChange(`+${country.code}${withoutOldCode}`);
      }
    }
  };

  return (
    <Box zIndex={2} position="relative">
      <Menu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        autoSelect={false}
        closeOnSelect={true}
      >
        <MenuButton as={Button} rightIcon={<BsChevronDown />} width="100%">
          {selectedCountryData
            ? `${selectedCountryData.name} (+${selectedCountryData.code})`
            : "Select Country"}
        </MenuButton>
        <MenuList maxHeight="300px" overflow="auto" zIndex={1000}>
          <Box px={3} pb={2}>
            <Input
              placeholder="Search countries..."
              onChange={(e) => setFilter(e.target.value)}
              size="sm"
            />
          </Box>
          {countries.map((country) => (
            <MenuItem
              key={country.iso}
              onClick={() => handleCountrySelect(country.iso)}
            >
              {country.name} (+{country.code})
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default CountrySelector;
