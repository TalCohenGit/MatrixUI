import React, { useState, useContext, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import useClickOutside from "../hooks/useClickOutside";

const AmountCell = ({ cellValue, rowIndex, colIndex, data, setData, cb }) => {
  // const { matrixData, setMatrixData } = useContext(DataContext);
  const [isFocus, setFocus] = useState(false);
  const [count, setCount] = useState(cellValue);
  const clickRef = React.createRef(null);
  useClickOutside(clickRef, () => setFocus(false));

  useEffect(() => {
    setCount(cellValue);
  }, [cellValue]);
  
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
            const currentData = [...data];
            currentData[rowIndex][colIndex] = count;
            cb(colIndex);
            setData(currentData);
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
