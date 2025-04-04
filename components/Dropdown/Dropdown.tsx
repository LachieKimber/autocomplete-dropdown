"use client";

import React, { useState, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
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

const filterOptions = (inputValue: string, data: OptionType[]): OptionType[] => {
  if (!inputValue) {
    return data.filter((option) => option.isCategory);
  }

  return data
    .map((group) => {
      if (group.isCategory) return group;

      const matchingOptions = group.options?.filter((opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase())
      );

      return { ...group, options: matchingOptions || [] };
    })
    .filter((group) => group.options?.length || group.isCategory);
};

// ✅ Highlight search term in the dropdown label
const highlightMatch = (text: string, query: string) => {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
  );
};

// ✅ Custom Clear Button
const ClearIndicator = (props: any) => {
  const { children = "×", getStyles, innerRef, innerProps } = props;
  return (
    <div {...innerProps} ref={innerRef} style={getStyles("clearIndicator", props)} className={styles.clearButton}>
      {children}
    </div>
  );
};

// ✅ Custom Option Renderer with Highlight
const CustomOption = (props: any) => {
  const { data, inputValue, ...rest } = props;

  return (
    <components.Option {...props}>
      {highlightMatch(data.label, inputValue)}
    </components.Option>
  );
};

// ✅ Custom SingleValue Renderer using react-select's wrapper (fixes spacing/styles)
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const SelectComponent = allowCreate ? CreatableSelect : Select;

  return (
    <div style={style} className={styles.selectContainer}>
      <SelectComponent
        key={JSON.stringify(data)}
        classNamePrefix="select"
        value={selectedOption}
        onChange={(option) => setSelectedOption(option || null)}
        options={filterOptions(inputValue, data)}
        onInputChange={(value) => setInputValue(value)}
        getOptionLabel={(e) => (e.parent ? `${e.label}` : e.label)}
        formatOptionLabel={(data, { inputValue }) => highlightMatch(data.label, inputValue)}
        placeholder={placeholder}
        isClearable
        components={{
          ClearIndicator,
          Option: CustomOption,
          SingleValue: CustomSingleValue,
        }}
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
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
      />
    </div>
  );
};

export default Dropdown;