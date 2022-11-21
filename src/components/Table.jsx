import React, { useContext, useState } from "react";
import TableCell from "./TableCell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSave } from "@fortawesome/fontawesome-free-solid";
import { DataContext } from "../context/DataContext";
import { removeRowFromBalanceTable, deleteAllTables } from "../utils/utils";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Table = ({
  data,
  setData,
  tableName,
  disabled = false,
  cb,
  bgColor,
  missingProductsCol,
}) => {
  const {
    balanceTableData,
    setBalanceTableData,
    setSelectedProducts,
    setMatrixComments,
  } = useContext(DataContext);

  const [isFocus, setFocus] = useState(false);

  const editTableToggle = () => {
    // if (isFocus && tableName === "balance") {
    //   cb()
    // }
    setFocus((prevState) => !prevState);
  };

  const showRemoveRow = (rowIndex) => {
    if (rowIndex !== 0 && tableName === "main") {
      return true;
    }
    return false;
  };

  const removeRow = (rowIndex) => {
    const currentTable = [...data];
    if (currentTable.length === 2) {
      deleteAllTables(
        setData,
        setBalanceTableData,
        setMatrixComments,
        setSelectedProducts
      );
      return;
    }
    const tableRowToRemove = currentTable[rowIndex];
    const newArr = [
      ...currentTable.slice(0, rowIndex),
      ...currentTable.slice(rowIndex + 1),
    ];
    setData(newArr);
    const newBalanceTable = removeRowFromBalanceTable(
      balanceTableData,
      tableRowToRemove
    );
    setBalanceTableData(newBalanceTable);
  };

  const tableData = data?.length
    ? data.map((rowData, rowIndex) => {
        return (
          <div style={{ display: "flex" }} key={rowIndex}>
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
                    missingProductsCol={missingProductsCol}
                    isFocus={isFocus}
                    setFocus={setFocus}
                  />
                );
              })}
            </div>
            {showRemoveRow(rowIndex) ? (
              <div
                className="trash-button"
                onClick={() => {
                  removeRow(rowIndex);
                }}
              >
                <FontAwesomeIcon icon={faTrash} color="#464d55" size="2x" />
              </div>
            ) : null}
          </div>
        );
      })
    : null;
  return (
    <div>
      {
      // tableName === "main" &&
       (
        <div
          className="edit-table"
          onClick={() => {
            editTableToggle();
          }}
        >
          <FontAwesomeIcon
            icon={!isFocus ? faPenToSquare : faSave}
            color="#00308F"
            size="3x"
          />
        </div>
      )}
      <div className="table">{tableData}</div>
    </div>
  );
};

export default Table;
