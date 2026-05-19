import React from "react";
import Select from "react-select";

const SelectSearch = () => {
  return (
    <Select
      styles={{
        control: (base) => ({
          ...base,
          height: 30,
          minHeight: 30,
          borderRadius: 4,
          border: "1px solid #d6d6d6",
          boxShadow: "none",
          "&:hover": { borderColor: "#d6d6d6" },
        }),
        valueContainer: (base) => ({
          ...base,
          padding: "0 6px",
        }),
        placeholder: (base) => ({
          ...base,
          color: "#8a8a8a",
          fontSize: 12,
        }),
        indicatorsContainer: (base) => ({
          ...base,
          height: 30,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: 4,
          color: "#9a9a9a",
        }),
        indicatorSeparator: (base) => ({
          ...base,
          backgroundColor: "#d6d6d6",
        }),
      }}
    />
  );
};

export default SelectSearch;
