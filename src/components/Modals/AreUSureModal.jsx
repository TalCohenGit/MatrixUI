import React from "react";
import Modal from "../../common/components/Modal/Modal";

const AreUSureModal = ({
  isOpen,
  toggleModal,
  onCancel,
  onDelete,
  header,
  deleteBtnText
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader={header}
    >
      <div className="LoadModal">
        {/* <h3>{header}</h3> */}
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button className="save-button" onClick={() => onDelete()}>
          {deleteBtnText}
        </button>
      </div>
    </Modal>
  );
};

export default AreUSureModal;
