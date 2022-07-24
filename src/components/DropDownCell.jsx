import React, { useState } from "react";
import Select from "react-select";

const DropDownCell = ({ dropdownOptions, rowIndex, colIndex,data,setData }) => {

  const customStyles={
    indicatorSeparator: (styles) => ({display:'none'}),
  }
  const options = [];
  dropdownOptions.forEach((element) => {
    options.push({ value: element.key, label: element.name })
  }
  );
  const handleSelect = (e) => {
    setSelectedOption(e);
    const currentData = [...data];
    currentData[rowIndex][colIndex] = e.value;
    setData(currentData);
  };
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Select
      defaultValue={selectedOption}
      onChange={(e) => handleSelect(e)}
      options={options}
      styles={customStyles}
    />
  );
};

export default DropDownCell;
