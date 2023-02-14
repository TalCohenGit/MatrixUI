import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";


const DropDownCell = ({ dropdownOptions, rowIndex, colIndex, data, setData, key }) => {
  const [loadedKey, setLoadedKey] = useState("")
  const [selectedOption, setSelectedOption] = useState(null);
  useEffect(() => {
    (async() => {
    const dropDownValue = data[rowIndex][colIndex]
    if(dropDownValue) {
      const dropdownOption = dropdownOptions.find(e => e.key === dropDownValue)
      if(dropdownOption) {
        setLoadedKey(dropdownOption.name)
        setSelectedOption({value:dropdownOption.key,label:dropdownOption.name})
      }
    }
  })()
}, [data]);

  const customStyles={
    indicatorSeparator: (styles) => ({display:'none'}),
  }
  const options = [];
  dropdownOptions.forEach((element) => {
    options.push({ value: element.key, label: element.name })
  }
  );
  const handleSelect = (e) => {
    console.log("handleSelect",e)
    setSelectedOption(e);
    const currentData = [...data];
    currentData[rowIndex][colIndex] = e.value;
    setData(currentData);
  };
  

  return (
    <Select
      key={key}
      defaultValue={selectedOption}
      value={selectedOption}
      onChange={(e) => handleSelect(e)}
      options={options}
      styles={customStyles}
      placeholder={loadedKey? loadedKey : "בחירה"}
    />
  );
};

export default DropDownCell;
