import React, { useContext, useState } from "react";
import ArrowButton from "./ArrowButton";
import { DataContext } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/fontawesome-free-solid";
import { removeProductCol, removeColFromTable } from "../utils/utils";

const HeaderNavigation = ({ children, data, setData, colIndex, tableName }) => {
  const {
    balanceTableData,
    setBalanceTableData,
    matrixComments,
    setMatrixComments,
    selectedProducts,
    setSelectedProducts
  } = useContext(DataContext);
  const [isHovered, setHover] = useState(false);

  const handleClick = (newIndex) => {
    const currentData = [...data];
    const currentBalanceData = [...balanceTableData];
    const temp1 = currentData[0][newIndex];
    const temp2 = currentBalanceData[0][newIndex];
    currentData[0][newIndex] = currentData[0][colIndex];
    currentData[0][colIndex] = temp1;
    currentBalanceData[0][newIndex] = currentBalanceData[0][colIndex];
    currentBalanceData[0][colIndex] = temp2;

    setData(currentData);
    setBalanceTableData(currentBalanceData);
  };

  const deleteFromCol = (colIndex) => {
    const currentData = [...data];
    const currentSelectedProducts = [...selectedProducts]
    const productName = currentData[0][colIndex]
    const newSelectedProducts = currentSelectedProducts.filter(element => element.value != productName)
    setSelectedProducts(newSelectedProducts)
    const currentMatrixComments = [...matrixComments];
    const { newMatrixData, newMatrixComments } = removeProductCol(
      colIndex,
      currentData,
      currentMatrixComments
    );
    setData(newMatrixData);
    setMatrixComments(newMatrixComments);
    const currentBalanceTable = [...balanceTableData];
    const newBalanceTable = removeColFromTable(
      colIndex,
      0,
      currentBalanceTable
    );
    setBalanceTableData(newBalanceTable);
  };

  const showRightArrow = colIndex !== 3;
  const showLeftArrow = colIndex !== data[0].length - 6;

  return (
    <>
      {tableName === "main" && isHovered && (
        <div style={{ position: "relative" }}>
          <div
            className="delete-column"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              color="#464d55"
              // style={{
              //   position: "absolute",
              //   bottom: "20px",
              //   right: "25px",
              //   cursor: "pointer",
              //   zIndex:"2",
              //   paddingBottom:"30px",
              //   padding:"10px 30px 30px 30px",
              //   background:"red"
              // }}
              // className="delete-column"
              // onMouseEnter={()=>setHover(true)}
              // onMouseLeave={() => setHover(false)}
              className="delete-column-icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteFromCol(colIndex);
              }}
            />
          </div>
        </div>
      )}
      <div
        className="HeaderNavigation"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {" "}
        {
          <ArrowButton
            showArrow={showRightArrow}
            rotation={180}
            handleClick={() => handleClick(colIndex - 1)}
            direction="right"
          />
        }
        {children}
        {
          <ArrowButton
            showArrow={showLeftArrow}
            handleClick={() => handleClick(colIndex + 1)}
            direction="left"
          />
        }
      </div>
    </>
  );
};

export default HeaderNavigation;
