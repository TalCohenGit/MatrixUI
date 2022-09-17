import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { DataContext } from "../context/DataContext";

const HeaderDropDown = ({ headerText, data, setData, colIndex, rowIndex }) => {
  const [isDropdown, setIsDropdown] = useState(false);
  const { selectedProducts, setSelectedProducts, products } =
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

  const handleSelect = (e) => {
    setSelectedOption(e);
    setIsDropdown(false);
    handleSelectedProducts(e.value);
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
