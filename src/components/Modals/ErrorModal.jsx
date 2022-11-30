import React from "react";
import Modal from "../../common/components/Modal/Modal";


const ErrorModal = ({
  isOpen,
  toggleModal,
  error
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader={error}
    >
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
      </div>
    </Modal>
  );
};

export default ErrorModal;
