import React, { useState, useEffect } from "react";
import CommentsModal from "./CommentsModal";
import {docInformationOptions} from "../utils/constants"

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
        הוסף
      </button>
      {isOpen && (
        <CommentsModal
          isOpen={isOpen}
          toggleModal={toggleModal}
          modalTitle={data[0][colIndex]}
          saveComments={saveComments}
          comments={comments}
          setComments={setComments}
          loadOldComments={loadOldComments}
          commentsCellOptions={docInformationOptions}
        />
      )}
    </div>
  );
};

export default CommentCell;
