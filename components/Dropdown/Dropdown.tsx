"use client";

import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import styles from "./Dropdown.module.scss"; // ✅ Import SCSS module

interface OptionType {
  label: string;
  value: string;
  isCategory?: boolean;
  options?: OptionType[];
  parentSport?: string;
}

const sportsData: OptionType[] = [
  { label: "Archery", value: "archery", isCategory: true },
  {
    label: "Archery Clubs",
    options: [
      { label: "Armidale Archers", value: "armidale_archers", parentSport: "Archery" },
      { label: "Bellingen Archers", value: "bellingen_archers", parentSport: "Archery" },
      { label: "Coast Archers", value: "coast_archers", parentSport: "Archery" },
    ],
  },
  { label: "Golf", value: "golf", isCategory: true },
  {
    label: "Golf Clubs",
    options: [
      { label: "Sydney Golf Club", value: "sydney_golf_club", parentSport: "Golf" },
      { label: "Wollombi Archibald Golf Club", value: "wollombi_archibald_golf_club", parentSport: "Golf" },
    ],
  },
  { label: "Tennis", value: "tennis", isCategory: true },
  {
    label: "Tennis Clubs",
    options: [{ label: "Melbourne Tennis Academy", value: "melbourne_tennis", parentSport: "Tennis" }],
  },
];

// ✅ Function to filter sports and clubs
const filterOptions = (inputValue: string, mounted: boolean): OptionType[] => {
  if (!mounted) return []; // ✅ Prevent hydration mismatch

  if (!inputValue) {
    return sportsData.filter((option) => option.isCategory);
  }

  return sportsData
    .map((sport) => {
      if (sport.isCategory) return sport;

      const matchingClubs = sport.options?.filter((club) =>
        club.label.toLowerCase().includes(inputValue.toLowerCase())
      );

      return { label: sport.label, options: matchingClubs || [] };
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

// ✅ Fix: Make `style` optional in TypeScript
const SportsDropdown = ({ style = {} }: { style?: React.CSSProperties }) => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // ✅ Prevent SSR mismatch

  return (
    <div style={style} className={styles.selectContainer}>
      <Select
        classNamePrefix="select"
        value={selectedOption}
        onChange={(option) => setSelectedOption(option || null)}
        options={filterOptions(inputValue, mounted)} // ✅ Ensures filtering runs only after mount
        onInputChange={(value) => setInputValue(value)}
        getOptionLabel={(e) => (e.parentSport ? `${e.label}` : e.label)}
        placeholder="Search by Sport or Club"
        isClearable
        components={{ ClearIndicator }}
      />
    </div>
  );
};

export default SportsDropdown;