import { useState, useMemo } from "react";
import countries from "../data/countries";

export const useCountries = (initialFilter: string = "") => {
  const [filter, setFilter] = useState(initialFilter);

  const filteredCountries = useMemo(() => {
    if (!filter) return countries;

    const searchTerm = filter.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchTerm) ||
        country.code.includes(searchTerm) ||
        country.iso.toLowerCase().includes(searchTerm)
    );
  }, [filter]);

  return {
    countries: filteredCountries,
    setFilter,
    filter,
  };
};
