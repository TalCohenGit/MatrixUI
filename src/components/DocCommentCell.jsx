import React, { useEffect, useState } from "react";
import DocCommentModal from "./DocCommentModal";

const DocCommentCell = ({ rowIndex, colIndex, data, setData }) => {
  const [isOpen, toggleModal] = useState(false);
  const [comment, setComment] = useState("");

  const openModal = () => {
    toggleModal(true);
  };

  const loadComment = () => {
    const savedComment = data[rowIndex][colIndex];
    if (savedComment?.length) {
      setComment(savedComment);
    } else {
      setComment("");
    }
  };

  const isCommented = comment.length > 0;

  useEffect(() => {
    loadComment();
  }, []);

  const onCancel = () => {
    loadComment();
    toggleModal(false);
  };

  return (
    <div>
      <button
        className={"docComment-button" + (isCommented ? " commented" : "")}
        onClick={openModal}
      >
        הערות
      </button>
      <DocCommentModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        rowIndex={rowIndex}
        colIndex={colIndex}
        data={data}
        setData={setData}
        comment={comment}
        setComment={setComment}
        onCancel={onCancel}
      />
    </div>
  );
};

export default DocCommentCell;
