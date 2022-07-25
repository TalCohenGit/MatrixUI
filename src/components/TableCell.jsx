import React, { useContext } from "react";
import AmountCell from "./AmountCell";
import DropDownCell from "./DropDownCell";
import CommentCell from "./CommentCell";
import DocCommentCell from "./DocCommentCell.jsx";


import { DataContext } from "../context/DataContext";

const TableCell = (props) => {
  const { rowLength, colIndex, cellValue, rowIndex, data, setData,disabled,bgColor } = props;
  const { drivers } = useContext(DataContext);

  let cellType;

  if (colIndex < 3 || rowIndex === 0) {
    cellType = <div>{cellValue}</div>;
  } else if(colIndex === rowLength - 1) {
    cellType = <DocCommentCell rowIndex={rowIndex} colIndex={colIndex} data={data} setData={setData}/>
  } else if (colIndex === rowLength - 2) {
    cellType = <CommentCell rowIndex={rowIndex} colIndex={colIndex} data={data} setData={setData}/>
  } else if (colIndex === rowLength - 3) {
      cellType = (
        <DropDownCell
          dropdownOptions={[{name: "חשבונית מס", key: 1}, {name: "חשבונית מס זיכוי", key: 3}, {name: "הזמנה", key: 6}]}
          rowIndex={rowIndex}
          colIndex={colIndex}
          data={data}
          setData={setData}
        />
      );
  } else if (colIndex === rowLength - 4) {
    cellType = (
      <DropDownCell
        dropdownOptions={[{name: "להפקה", key: 1}, {name: "ללא", key: 2}, {name: "מיוחד", key: 3}]}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else if (colIndex === rowLength - 5) {
    cellType = (
      <DropDownCell
        dropdownOptions={drivers}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
      />
    );
  } else {
    cellType = <AmountCell {...props} />;
  }
  return (
    <div
      className="table-cell"
      style={{
        opacity: cellValue  === null ? "0" : "1",
        pointerEvents: disabled ? "none" : "auto",
        backgroundColor: cellValue === "" ? 'none' : bgColor
      }}
    >
      {cellType}
    </div>
  );
};

export default TableCell;
