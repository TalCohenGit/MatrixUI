import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";

const AmountCell = ({
  cellValue,
  rowIndex,
  colIndex,
}) => {
  const { matrixData, setMatrixData } = useContext(DataContext);
  const [isFocus, setFocus] = useState(false);
  const [count, setCount] = useState(cellValue);
  return (
    <>
      {" "}
      {isFocus ? (
        <input
          type="number"
          min="0"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          onBlur={() => {
            const currentMatrixData = [...matrixData];
            currentMatrixData[rowIndex][colIndex] = count;
            setMatrixData(currentMatrixData);
            setFocus(false);
          }}
        />
      ) : (
        <div
          onClick={() => {
            setFocus(true);
          }}
        >
          {count}
        </div>
      )}
    </>
  );
};

export default AmountCell;
