import React, { useState, useContext } from "react";
import Select from "react-select";
import { DataContext } from "../context/DataContext";

const DropDownCell = ({ dropdownOptions, rowIndex, colIndex,data,setData }) => {

  const customStyles={
    indicatorSeparator: (styles) => ({display:'none'}),
  }
  // const { matrixData, setMatrixData } = useContext(DataContext);
  const options = [];
  dropdownOptions.map((option) =>
    options.push({ value: option, label: option })
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
