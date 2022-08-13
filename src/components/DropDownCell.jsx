import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { DataContext } from "../context/DataContext";


const DropDownCell = ({ dropdownOptions, rowIndex, colIndex, data, setData }) => {
  const [loadedKey, setLoadedKey] = useState("")
  const { drivers } = useContext(DataContext);

  useEffect(() => {
    (async() => {
    const dropDownValue = data[rowIndex][colIndex]
    if(dropDownValue) {
      const dropdownOption = dropdownOptions.find(e => e.key === dropDownValue)
      if(dropdownOption) {
        setLoadedKey(dropdownOption.name)
      }
    }
  })()
}, [drivers]);

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
      placeholder={loadedKey? loadedKey : "בחירה"}
    />
  );
};

export default DropDownCell;
