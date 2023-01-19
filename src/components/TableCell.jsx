import React, { useContext } from "react";
import AmountCell from "./AmountCell";
import DropDownCell from "./DropDownCell";
import CommentCell from "./CommentCell";
import DocCommentCell from "./DocCommentCell.jsx";
import HeaderDropDown from "./HeaderDropdown";
import { DataContext } from "../context/DataContext";
import {
  faMinimize
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@mui/material";


const TableCell = (props) => {
  const {
    rowLength,
    colIndex,
    cellValue,
    rowIndex,
    data,
    setData,
    disabled,
    bgColor,
    tableName,
    minimize,
    isMinimized,
  } = props;
  const { drivers, balanceTableData } = useContext(DataContext);

  let cellType;
  const minimizeIndex = rowIndex === 3 & colIndex === 1;

  if (rowIndex === 0) {
    if (colIndex < 3 || (rowLength > 7 && colIndex > rowLength - 6)) {
      cellType = <b>{cellValue}</b>;
    } else {
      cellType = (
        <HeaderDropDown
          headerText={cellValue}
          data={data}
          setData={setData}
          colIndex={colIndex}
          rowIndex={rowIndex}
          tableName={tableName}
        />
      );
    }
  } else if (
    tableName !== "main" &&
    rowIndex === data.length - 1 &&
    colIndex === 1
  ) {
    cellType = (
      <Tooltip title={`${isMinimized ? "הרחב" : "מזער"} טבלת מלאי`}>
      <div
        onClick={() => {
          minimize(!isMinimized);
        }}
        
      >
      <FontAwesomeIcon
              icon={faMinimize}
              size="2x"
              color="#00308F"
              className="minimize-icon"
            />
      </div>
      </Tooltip>
    );
  } else if (colIndex < 3) {
    cellType = cellValue;
  } else if (colIndex === rowLength - 1) {
    cellType = (
      <DocCommentCell
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else if (colIndex === rowLength - 2) {
    cellType = (
      <CommentCell
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else if (colIndex === rowLength - 3) {
    cellType = (
      <DropDownCell
        key={"actions"}
        dropdownOptions={[
          { name: "להפקה", key: 1 },
          { name: "ללא", key: 2 },
          { name: "מיוחד", key: 3 },
        ]}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else if (colIndex === rowLength - 4) {
    cellType = (
      <DropDownCell
        key={"drivers"}
        dropdownOptions={drivers}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else if (colIndex === rowLength - 5) {
    cellType = (
      <DropDownCell
        key={"docType"}
        dropdownOptions={[
          { name: "חשבונית מס", key: 1 },
          { name: "חשבונית מס זיכוי", key: 3 },
          { name: "הזמנה", key: 6 },
        ]}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else {
    cellType = <AmountCell cellValue={Number(cellValue).toFixed(2)} {...props} />;
  }

  return (
    <div
      className="table-cell"
      style={{
        opacity:
          cellValue === null && (rowIndex !== data.length - 1 || colIndex !== 1)
            ? "0"
            : "1",
        pointerEvents:
          disabled &&
          rowIndex !== 1 &&
          (rowIndex !== data.length - 1 || colIndex !== 1)
            ? "none"
            : "auto",
        backgroundColor: cellValue === "" || minimizeIndex ? "none" : bgColor,
        border: (colIndex === rowLength - 1) || minimizeIndex ? "1px solid transparent" : "1px solid #a9a9a9",
        color:
          balanceTableData?.length > 0 && balanceTableData[3][colIndex] < 0
            ? "red"
            : "black",
         position: colIndex === 0 && "sticky",  
         right: colIndex === 0 && 0,   
         zIndex: colIndex === 0 && 1,
      }}
    >
      {cellType}
    </div>
  );
};

export default TableCell;
