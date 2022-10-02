import React from "react";
import Modal from "../../common/components/Modal/Modal";


const CopyDataModal = ({
  isOpen,
  toggleModal,
  onCancel,
  onCopy
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader="המטריצה הופקה. האם לשכפל אותה?"
    >
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button className="cancel-button" onClick={() => onCopy()}>
          שכפל מטריצה
        </button>
      </div>
    </Modal>
  );
};

export default CopyDataModal;
