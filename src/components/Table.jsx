import React, { useContext } from "react";
import TableCell from "./TableCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";
import { DataContext } from "../context/DataContext";
import { removeRowFromBalanceTable } from "../utils/utils"

const Table = ({ data, setData, tableName, disabled = false, cb, bgColor }) => {
  const {balanceTableData, setBalanceTableData, setSelectedProducts} = useContext(DataContext)


  const showRemoveRow = (rowIndex) => {
    if (rowIndex !== 0 && tableName === "main") {
      return true
    }
    return false
  }
  
  const removeRow = (rowIndex) => {
    const currentTable = [...data]
    if(currentTable.length === 2) {
      setData([])
      setBalanceTableData([])
      setSelectedProducts([])
      return;
    } 
    const tableRowToRemove = currentTable[rowIndex]
    const newArr = [...currentTable.slice(0, rowIndex), ...currentTable.slice(rowIndex + 1)]
    setData(newArr)
    // if(tableName === "main")return
    const newBalanceTable = removeRowFromBalanceTable(balanceTableData, tableRowToRemove)
    setBalanceTableData(newBalanceTable)
  }

  const tableData = data?.length
    ? data.map((rowData, rowIndex) => {
        return (
          <div style={{display:"flex"}} key={rowIndex}>
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
                    tableName={tableName}
                  />
                );
              })}
            </div>
            {showRemoveRow(rowIndex) ? <div className="trash-button" onClick={() => {removeRow(rowIndex)}}><FontAwesomeIcon icon={faTrash} color="#464d55" size="2x" />
</div> : null}
          </div>
        );
      })
    : null;
  return <div className="table">{tableData}</div>;
};

export default Table;
