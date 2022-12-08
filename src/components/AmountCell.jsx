import React, { useState, useEffect, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment
} from "@fortawesome/fontawesome-free-solid";
import CommentsModal from "./CommentsModal";
import {
  numOfColBeforeProducts,
  commentsCellOptions,
} from "../utils/constants";

const AmountCell = ({
  cellValue,
  rowIndex,
  colIndex,
  data,
  setData,
  cb,
  isFocus,
  tableName,
}) => {
  const [isOpen, toggleModal] = useState(false);
  const [isHovered, setHover] = useState(false);
  const [count, setCount] = useState(cellValue);
  const clickRef = React.createRef(null);
  const intialValue = { selectValue: "", inputValue: "" };
  const [comments, setComments] = useState([intialValue]);

  const { matrixComments, setMatrixComments } = useContext(DataContext);

  useEffect(() => {
    setCount(cellValue);
  }, [cellValue]);

  useEffect(() => {
    if (tableName === "main" && matrixComments?.length && matrixComments[0][0] && matrixComments[rowIndex-1][colIndex-3]) {
      setComments(matrixComments[rowIndex-1][colIndex-3])
    }
  },[])

  const saveComments = (comments) => {
    const newMatrixComments = [...matrixComments];
    newMatrixComments[rowIndex - 1][colIndex - numOfColBeforeProducts] =
      comments;
    console.log("saveComments newMatrixComments", newMatrixComments)
    setMatrixComments(newMatrixComments);
  };

  const loadOldComments = () => {
    const commentsInCell =
      matrixComments[rowIndex - 1][colIndex - numOfColBeforeProducts];
    if (commentsInCell) {
      setComments(commentsInCell);
    }
  };

  const { inputValue, selectValue } = comments[0];

  const isPermanent = inputValue?.length && selectValue?.length;

  return (
    <>
      {" "}
      {isFocus && (tableName === "main" || rowIndex === 1) ? (
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
          }}
        />
      ) : (
        <div
          dir="ltr"
          ref={clickRef}
          className="count-wrapper"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {(isHovered || isPermanent) ? (
            <span
              className="comment"
              onClick={(e) => {
                e.stopPropagation();
                toggleModal(true);
              }}
            >
              <FontAwesomeIcon
                icon={faComment}
                color={isPermanent ? "#3D9970" : "#464d55"}
              />
            </span>
          ) : <div/>}
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
              commentsCellOptions={commentsCellOptions}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AmountCell;
