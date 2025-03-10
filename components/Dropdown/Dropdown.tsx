"use client";

import React, { useState, useEffect } from "react";
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

const filterOptions = (inputValue: string, data: OptionType[]): OptionType[] => {
  if (!inputValue) {
    return data.filter((option) => option.isCategory);
  }

  return data
    .map((sport) => {
      if (sport.isCategory) return sport;

      const matchingClubs = sport.options?.filter((club) =>
        club.label.toLowerCase().includes(inputValue.toLowerCase())
      );

      return { ...sport, options: matchingClubs || [] };
    })
    .filter((group) => group.options?.length || group.isCategory);
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

const Dropdown = ({ data, placeholder = "Search...", style = {} }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div style={style} className={styles.selectContainer}>
      <Select
        key={JSON.stringify(data)} // ✅ Forces re-render when `data` changes
        classNamePrefix="select"
        value={selectedOption}
        onChange={(option) => setSelectedOption(option || null)}
        options={filterOptions(inputValue, data)}
        onInputChange={(value) => setInputValue(value)}
        getOptionLabel={(e) => (e.parent ? `${e.label}` : e.label)}
        placeholder={placeholder}
        isClearable
        components={{ ClearIndicator }}
      />
    </div>
  );
};

export default Dropdown;