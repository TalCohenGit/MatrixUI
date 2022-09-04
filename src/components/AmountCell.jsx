import React, { useState, useEffect, useContext } from "react";
import useClickOutside from "../hooks/useClickOutside";
import { DataContext } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/fontawesome-free-solid";
import CommentsModal from "./CommentsModal";
import { numOfColBeforeProducts } from "../utils/constants";

const AmountCell = ({ cellValue, rowIndex, colIndex, data, setData, cb }) => {
  const [isOpen, toggleModal] = useState(false);
  const [isHovered, setHover] = useState(false);
  const [isFocus, setFocus] = useState(false);
  const [count, setCount] = useState(cellValue);
  const clickRef = React.createRef(null);
  const intialValue = { selectValue: "", inputValue: "" };
  const [comments, setComments] = useState([intialValue]);

  useClickOutside(clickRef, () => {
    if(isFocus){
      setFocus(false)
    }
  });

  const {matrixComments, setMatrixComments} = useContext(DataContext)

  useEffect(() => {
    setCount(cellValue);
  }, [cellValue]);

  const saveComments = (comments) => {
    const newMatrixComments = [...matrixComments];
    newMatrixComments[rowIndex - 1][colIndex - numOfColBeforeProducts] = comments;
    setMatrixComments(newMatrixComments);
  };

  const loadOldComments = () => {
    const commentsInCell = matrixComments[rowIndex-1][colIndex-numOfColBeforeProducts]
    if(commentsInCell){
      setComments(commentsInCell) 
    }
  }

  return (
    <>
      {" "}
      {isFocus ? (
        <input
          dir="ltr"
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
          autoFocus

        />
      ) : (
        <div
          dir="ltr"
          ref={clickRef}
          className="count-wrapper"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => {
            setFocus(true);
          }} 
        >
          {isHovered && (
            <span
              className="comment"
              onClick={(e) => {
                e.stopPropagation();
                toggleModal(true);
              }}
            >
              <FontAwesomeIcon icon={faComment} color="#464d55" />
            </span>
          )}
          <span className="count">{count}</span>

          {isOpen && (
            <CommentsModal
              isOpen={isOpen}
              toggleModal={toggleModal}
              rowIndex={rowIndex}
              colIndex={colIndex}
              modalTitle={data[0][colIndex]}
              saveComments={saveComments}
              comments={comments}
              setComments={setComments}
              loadOldComments={loadOldComments}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AmountCell;
