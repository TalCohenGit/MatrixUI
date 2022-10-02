import React, { useContext, useState } from "react";
import DatePicker from "../DatePicker";
import Modal from "../../common/components/Modal/Modal";
import { modalAction, savingAsAction } from "../../utils/constants";

const SaveModal = ({
  isOpen,
  toggleModal,
  handleAction,
  action,
  dateValue,
  setDateValue,
  matrixName,
  setMatrixName,
}) => {
  const [isBi, setIsBi] = useState(true);

  const handleChange = () => {
    setIsBi(!isBi);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader={"פרטים ל" + modalAction[action]}
    >
      <div className="save-matrix-modal">
        {action === savingAsAction && (
          <input
            style={{ width: "100%" }}
            value={matrixName}
            type="text"
            id="matrixName"
            onChange={(e) => {
              setMatrixName(e.target.value);
            }}
            placeholder="בחר שם למטריצה"
          />
        )}
        <label>
          <input
            type="checkbox"
            checked={isBi}
            // defaultChecked={true}
            onChange={() => handleChange()}
          />
          שלח לדו"חות
        </label>
        <h3>בחר תאריך ערך</h3>
        <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
        <button
          className={
            "save-button" +
            (action === savingAsAction && !matrixName?.length
              ? " disabled"
              : "")
          }
          onClick={() => handleAction(action, toggleModal, isBi)}
        >
          {modalAction[action]}
        </button>
      </div>
    </Modal>
  );
};

export default SaveModal;
