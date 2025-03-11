"use client";

import React, { useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import styles from "./Dropdown.module.scss";

interface OptionType {
  label: string;
  value: string;
  isCategory?: boolean;
  options?: OptionType[];
  parent?: string;
}

interface DropdownProps {
  data: OptionType[];
  placeholder?: string;
  style?: React.CSSProperties;
}

// Debounce function to delay filtering
const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Custom Clear Button
const ClearIndicator = (props: any) => {
  const { children = "×", getStyles, innerRef, innerProps } = props;
  return (
    <div {...innerProps} ref={innerRef} style={getStyles("clearIndicator", props)} className={styles.clearButton}>
      {children}
    </div>
  );
};

const Dropdown = ({ data, placeholder = "Search...", style = {} }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration error by ensuring component only renders on client
  useEffect(() => {
    setIsClient(true);
    setFilteredOptions(data.filter((option) => option.isCategory)); // Load initial categories
  }, [data]);

  // Debounced search handler
  const handleSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setIsFiltering(true); // Show loading state

        if (!searchTerm) {
          setFilteredOptions(data.filter((option) => option.isCategory));
          setIsFiltering(false);
          return;
        }

        // Simulate processing delay
        setTimeout(() => {
          const results = data
            .map((group) => {
              if (group.isCategory) return group;

              const matchingClubs = group.options?.filter((club) =>
                club.label.toLowerCase().includes(searchTerm.toLowerCase())
              );

              return { ...group, options: matchingClubs || [] };
            })
            .filter((group) => group.options?.length || group.isCategory);

          setFilteredOptions(results);
          setIsFiltering(false); // Stop loading state
        }, 200);
      }, 300), // Debounce delay
    [data]
  );

  // Run the debounced search when `inputValue` changes
  useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue, handleSearch]);

  // Hide dropdown until filtering is complete & results exist
  const showDropdown = isClient && (!isFiltering || filteredOptions.length > 0);

  if (!isClient) return null; // Fix hydration error by ensuring client-side rendering

  return (
    <div style={style} className={styles.selectContainer}>
      {showDropdown && (
        <Select
          classNamePrefix="select"
          value={selectedOption}
          onChange={(option) => setSelectedOption(option || null)}
          options={filteredOptions} // Only show results when filtering is done
          onInputChange={(value) => setInputValue(value)}
          getOptionLabel={(e) => (e.parent ? `${e.label}` : e.label)}
          placeholder={placeholder}
          isClearable
          components={{ ClearIndicator }}
          isLoading={isFiltering} // Show spinner while filtering
        />
      )}
    </div>
  );
};

export default Dropdown;