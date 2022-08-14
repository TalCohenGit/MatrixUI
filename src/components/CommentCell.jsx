import React, { useContext, useState, useEffect } from "react";
import { DataContext } from "../context/DataContext";
import CommentsModal from "./CommentsModal";

const CommentCell = ({ rowIndex, colIndex, data, setData }) => {
  const [isOpen, toggleModal] = useState(false);
  const intialValue = { selectValue: "", inputValue: "" };
  const [comments, setComments] = useState([intialValue]);

  const addComments = () => {
    toggleModal(true);
  };

  const saveComments = (comments) => {
    const newMatrixData = [...data];
    newMatrixData[rowIndex][colIndex] = comments;
    setData(newMatrixData);
  };

  const loadOldComments = () => {
    const commentsInCell = data[rowIndex][colIndex]
    if(commentsInCell){
      setComments(commentsInCell) 
    }
  }

  useEffect(() => {
    const commentsInCell = data[rowIndex][colIndex];
    if (commentsInCell) {
      setComments(commentsInCell);
    }
  }, []);

  return (
    <div>
      <button className="createInvoice-button" onClick={() => addComments()}>
        הוספה
      </button>
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
  );
};

export default CommentCell;
