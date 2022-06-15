import React, {useContext} from "react";
import TableCell from "./TableCell";
import { DataContext } from "../context/DataContext";


const Table = () => {
  const { matrixData } = useContext(DataContext);
  const tableData =
    matrixData?.length &&
    matrixData.map((rowData, rowIndex) => {
      return (
        <div className="table-row" key={rowIndex}>
          {rowData.map((cellValue, colIndex) => {
            return (
              <TableCell
                key={`${rowIndex},${colIndex}`}
                cellValue={cellValue}
                rowIndex={rowIndex}
                colIndex={colIndex}
                rowLength={rowData.length}
              />
            );
          })}
        </div>
      );
    });
  return (
    <div>
      <div className="table">{tableData}</div>
    </div>
  );
};

export default Table;
