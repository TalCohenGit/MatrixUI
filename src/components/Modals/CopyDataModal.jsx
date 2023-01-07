import React from "react";
import Modal from "../../common/components/Modal/Modal";


const CopyDataModal = ({
  isOpen,
  toggleModal,
  onCopy,
  modalHeader,
  afterProduce,
  onNewMatrix,
  action
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader={modalHeader}
      action={action}
    >
      <div className="action-buttons">
        {!afterProduce && <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>}
        <button className="save-button" onClick={() => onCopy()}>
          שכפל מטריצה
        </button>
        {afterProduce && <button className="save-button" onClick={() => onNewMatrix()}>
          צור מטריצה חדשה
        </button>}
      </div>
    </Modal>
  );
};

export default CopyDataModal;
