import React, { useState, useEffect } from "react";
import CommentsModal from "./CommentsModal";
import { docInformationOptions } from "../utils/constants";

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
    const commentsInCell = data[rowIndex][colIndex];
    if (commentsInCell) {
      setComments(commentsInCell);
    }
  };

  const onCancel = () => {
    loadOldComments();
    toggleModal(false);
  };

  useEffect(() => {
    loadOldComments();
  }, []);

  const isCommented = 
      comments[0]?.inputValue?.length > 0 &&
      comments[0]?.selectValue?.length > 0;

  return (
    <div>
      <button
        className={"createInvoice-button" + (isCommented ? " commented" : "")}
        onClick={() => addComments()}
      >
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
          onCancel={onCancel}
        />
      )}
    </div>
  );
};

export default CommentCell;
