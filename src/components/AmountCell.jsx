import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import useClickOutside from "../hooks/useClickOutside";

const AmountCell = ({
  cellValue,
  rowIndex,
  colIndex,
}) => {
  const { matrixData, setMatrixData } = useContext(DataContext);
  const [isFocus, setFocus] = useState(false);
  const [count, setCount] = useState(cellValue);
  const clickRef = React.createRef(null)
  useClickOutside(clickRef, () => setFocus(false));

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
          ref={clickRef}
        >
          {count}
        </div>
      )}
    </>
  );
};

export default AmountCell;
