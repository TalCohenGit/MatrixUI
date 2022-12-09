import React, { useState } from "react";
import Modal from "../common/components/Modal/Modal";


const DocCommentModal = ({ isOpen, toggleModal, rowIndex, colIndex, data, setData, comment, setComment,onCancel }) => {
  
  const customerName = data[rowIndex][0]
  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={customerName}>
      <div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="הוסף הערה"
          className="single-comment"
        />
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button
          className="save-button"
          onClick={() => {
            const currentData = [...data];
            currentData[rowIndex][colIndex] = comment;
            setData(currentData);
            toggleModal(false);
          }}
        >
          שמור
        </button>
      </div>
    </Modal>
  );
};

export default DocCommentModal;
