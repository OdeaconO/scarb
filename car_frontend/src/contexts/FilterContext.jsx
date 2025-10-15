import { createContext, useState } from "react";

const FilterContext = createContext({
  filters: {},
  setFilters: () => {},
});

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState({
    q: "",
    brand: "",
    model: "",
    year: "",
    seating: "",
    transmission: "",
    bodyStyle: "",
  });

  return (
    <FilterContext.Provider value={{ filters, setFilters }}>
      {children}
    </FilterContext.Provider>
  );
}

export default FilterContext;
