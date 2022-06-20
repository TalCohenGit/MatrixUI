import React, { useState, useContext } from "react";
import Select from "react-select";
import { DataContext } from "../context/DataContext";

const DropDownCell = ({ dropdownOptions, rowIndex, colIndex }) => {
  const { matrixData, setMatrixData } = useContext(DataContext);
  console.log("dropdownOptions", dropdownOptions);
  const customStyles = {
    // container: () => ({
    //   width: "100%",
    // }),
    indicatorsContainer: () => ({
      color: "red",
    }),
  };
  const options = [];
  dropdownOptions.map((option) =>
    options.push({ value: option, label: option })
  );
  console.log("options", options);
  const handleSelect = (e) => {
    setSelectedOption(e);
    const currentMatrixData = [...matrixData];
    currentMatrixData[rowIndex][colIndex] = e.value;
    setMatrixData(currentMatrixData);
  };
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Select
      defaultValue={selectedOption}
      onChange={(e) => handleSelect(e)}
      options={options}
      // styles={customStyles}
    />
  );
};

export default DropDownCell;
