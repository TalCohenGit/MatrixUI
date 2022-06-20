import React, { useContext } from "react";
import AmountCell from "./AmountCell";
import DropDownCell from "./DropDownCell";
import { DataContext } from "../context/DataContext";

const TableCell = (props) => {
  const { rowLength, colIndex, cellValue, rowIndex } = props;
  const { drivers } = useContext(DataContext);

  let cellType;

  if (colIndex < 3 || rowIndex === 0) {
    cellType = <div>{cellValue}</div>;
  } else if (colIndex === rowLength - 1) {
    cellType = <DropDownCell dropdownOptions={["להפקה", "ללא", "מיוחד"]} rowIndex={rowIndex} colIndex={colIndex}/>;
  } else if (colIndex === rowLength - 2) {
    cellType = <DropDownCell dropdownOptions={drivers} rowIndex={rowIndex} colIndex={colIndex}/>;
  } else {
    cellType = <AmountCell {...props} />;
  }
  return <div className="table-cell">{cellType}</div>;
};

export default TableCell;
