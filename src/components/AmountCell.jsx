import React, { useState, useEffect, useContext } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { DataContext } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/fontawesome-free-solid";
import CommentsModal from "./CommentsModal";

const AmountCell = ({ cellValue, rowIndex, colIndex, data, setData, cb }) => {
  const  [isOpen, toggleModal] = useState(false);

  const [isHovered, setHover] = useState(false);
  const [isFocus, setFocus] = useState(false);
  // const [on]
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
          className="count-wrapper"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            setFocus(true);
          }}
          ref={clickRef}
        >
          {isHovered && (
            <span className="comment" onClick={(e) => {
              e.stopPropagation()
              toggleModal(true)}}>
              <FontAwesomeIcon icon={faComment} color="#464d55" />
            </span>
          )}
          <span className="count">{count}</span>

          {/* <button onMouseEnter={() => setCommentPart(true)}></button> */}
          {isOpen && <CommentsModal
            isOpen={isOpen}
            toggleModal={toggleModal}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />}
        </div>
      )}
    </>
  );
};

export default AmountCell;
