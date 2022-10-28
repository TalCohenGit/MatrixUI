import React, { useEffect, useState } from "react";
import DatePicker from "../DatePicker";
import Modal from "../../common/components/Modal/Modal";
import {
  modalAction,
  savingAsAction,
  savingAction,
} from "../../utils/constants";

const SaveModal = ({
  isOpen,
  toggleModal,
  handleAction,
  action,
  matrixName
}) => {
  const [isBi, setIsBi] = useState(true);
  const [newMatrixName, setNewMatrixName] = useState("");
  const [dateValue, setDateValue] = useState(new Date())

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
            value={newMatrixName}
            type="text"
            id="newMatrixName"
            onChange={(e) => {
              setNewMatrixName(e.target.value);
            }}
            placeholder="בחר שם למטריצה"
          />
        )}
        {action === savingAction && !matrixName && (
          <input
            style={{ width: "100%" }}
            value={newMatrixName}
            type="text"
            id="newMatrixName"
            onChange={(e) => {
              setNewMatrixName(e.target.value);
            }}
            placeholder="שנה שם למטריצה"
          />
        )}
        {action === savingAction && matrixName && (
          <div>
          <p>שם המטריצה: {matrixName}</p>
          </div>
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
            (action === savingAsAction && !newMatrixName?.length
              ? " disabled"
              : "")
          }
          onClick={() => {
            handleAction(action, toggleModal, isBi, newMatrixName, dateValue)
            setNewMatrixName("")
          }
          }>
          {modalAction[action]}
        </button>
      </div>
    </Modal>
  );
};

export default SaveModal;
