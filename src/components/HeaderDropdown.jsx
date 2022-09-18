import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { DataContext } from "../context/DataContext";

const HeaderDropDown = ({ headerText, data, setData, colIndex, rowIndex }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const { selectedProducts, setSelectedProducts, products, balanceTableData, setBalanceTableData } =
    useContext(DataContext);
 
  const customStyles = {
    indicatorSeparator: () => ({ display: "none" }),
  };
 
  const options = products
    .map((product) => {
      return {
        value: product["שם פריט"],
        label: product["שם פריט"],
      };
    })
    .filter(
      (product) =>
        !selectedProducts
          .map((selectedProduct) => selectedProduct.value)
          .includes(product.value)
    );

  const handleSelectedProducts = (value) => {
    let currentSelected = [...selectedProducts];
    const indexForRemovedItem = currentSelected.findIndex(
      (product) => product.value === headerText
    );
    currentSelected.splice(indexForRemovedItem, 1);
    currentSelected.push({ value, label: value });
    setSelectedProducts(currentSelected);
  };

  const handleBalanceTable = (value) => {
    console.log("handleBalanceTable value to change", value)
    console.log("handleBalanceTable products:", products)
    const productObj = products.find(element => element["שם פריט"] === value)
    console.log("handleBalanceTable productObj:", productObj)
    const newValue = productObj["מפתח פריט אב"]
    console.log("handleBalanceTable newValue:", newValue)
    const currentBalanceTable = [...balanceTableData]
    currentBalanceTable[0][colIndex] = newValue
    setBalanceTableData(currentBalanceTable)
  }

  const handleSelect = (e) => {
    setSelectedOption(e);
    setIsDropdown(false);
    handleSelectedProducts(e.value);
    handleBalanceTable(e.value);
    const currentData = [...data];
    currentData[rowIndex][colIndex] = e.value;
    setData(currentData);
  };
  const [selectedOption, setSelectedOption] = useState(null);

  return isDropdown ? (
    <Select
      defaultValue={selectedOption}
      onChange={(e) => handleSelect(e)}
      options={options}
      styles={customStyles}
      placeholder={"בחר מוצר"}
      onBlur={() => setIsDropdown(false)}
      autoFocus
      hideSelectedOptions
    />
  ) : (
    <b
      onClick={() => {
        setIsDropdown(true);
      }}
    >
      {headerText}
    </b>
  );
};

export default HeaderDropDown;
