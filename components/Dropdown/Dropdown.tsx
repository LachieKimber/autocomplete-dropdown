"use client";

import React, { useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
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
  allowCreate?: boolean;
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

// Custom selected item renderer to preserve spacing/styling
const CustomSingleValue = (props: any) => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      {data.label}
    </components.SingleValue>
  );
};

const Dropdown = ({
  data,
  placeholder = "Search...",
  style = {},
  allowCreate = false,
}: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFilteredOptions(data.filter((option) => option.isCategory));
  }, [data]);

  const handleSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setIsFiltering(true);

        if (!searchTerm) {
          setFilteredOptions(data.filter((option) => option.isCategory));
          setIsFiltering(false);
          return;
        }

        setTimeout(() => {
          const results = data
            .map((group) => {
              if (group.isCategory) return group;

              const matchingOptions = group.options?.filter((opt) =>
                opt.label.toLowerCase().includes(searchTerm.toLowerCase())
              );

              return { ...group, options: matchingOptions || [] };
            })
            .filter((group) => group.options?.length || group.isCategory);

          setFilteredOptions(results);
          setIsFiltering(false);
        }, 200);
      }, 300),
    [data]
  );

  useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue, handleSearch]);

  const showDropdown = isClient && (!isFiltering || filteredOptions.length > 0);

  if (!isClient) return null;

  const SelectComponent = allowCreate ? CreatableSelect : Select;

  return (
    <div style={style} className={styles.selectContainer}>
      {showDropdown && (
        <SelectComponent
          key={JSON.stringify(data)}
          classNamePrefix="select"
          value={selectedOption}
          onChange={(option) => setSelectedOption(option || null)}
          options={filteredOptions}
          onInputChange={(value) => setInputValue(value)}
          getOptionLabel={(e) => (e.parent ? `${e.label}` : e.label)}
          placeholder={placeholder}
          isClearable
          components={{
            ClearIndicator,
            SingleValue: CustomSingleValue,
          }}
          isLoading={isFiltering}
          formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
          onCreateOption={
            allowCreate
              ? (input) => {
                  const newOption = {
                    label: input,
                    value: input.toLowerCase().replace(/\s+/g, "_"),
                  };
                  setSelectedOption(newOption);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default Dropdown;