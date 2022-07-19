import React from "react";
import TableCell from "./TableCell";

const Table = ({ data, setData, tableName, disabled = false, cb, bgColor }) => {
  const tableData = data?.length
    ? data.map((rowData, rowIndex) => {
        return (
          <div className="table-row" key={`${tableName},${rowIndex}`}>
            {rowData.map((cellValue, colIndex) => {
              return (
                <TableCell
                  key={`${tableName},${rowIndex},${colIndex}`}
                  cellValue={cellValue}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  rowLength={rowData.length}
                  data={data}
                  setData={setData}
                  disabled={disabled}
                  cb={cb}
                  bgColor={bgColor}
                />
              );
            })}
          </div>
        );
      })
    : null;
  return (
    <div className="table">
      {tableData}
    </div>
  );
};

export default Table;
