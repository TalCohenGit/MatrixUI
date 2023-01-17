import React, { useEffect, useState } from "react";
import DatePicker from "../DatePicker";
import Modal from "../../common/components/Modal/Modal";
import { modalAction, savingAsAction, savingAction, copyMatrixAction } from "../../utils/constants";
import { set } from "lodash";

const SaveModal = ({
  isOpen,
  toggleModal,
  handleAction,
  action,
  newMatrixName,
  setNewMatrixName,
  matrixName,
  isProduced = false,
}) => {
  console.log({ matrixName, action, isProduced, newMatrixName });
  const [isBi, setIsBi] = useState(false);

  const [dateValue, setDateValue] = useState(new Date());

  useEffect(() => {
    setNewMatrixName(matrixName);
  }, [matrixName]);
  const handleChange = () => {
    setIsBi(!isBi);
  };

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={"פרטים ל" + modalAction[action]} action={action}>
      <div className="save-matrix-modal">
        {(action === savingAsAction || action === copyMatrixAction) && (
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

        {action !== copyMatrixAction && (
          <label>
            <input
              type="checkbox"
              checked={isBi}
              // defaultChecked={true}
              onChange={() => handleChange()}
            />
            שלח לדו"חות
          </label>
        )}
        <h3>בחר תאריך ערך</h3>
        <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
      </div>
      <div className="action-buttons">
        {action != copyMatrixAction && (
          <button className="cancel-button" onClick={() => toggleModal(false)}>
            בטל
          </button>
        )}
        <button
          className={
            "save-button" +
            ((action === savingAsAction || action === copyMatrixAction) && !newMatrixName?.length ? " disabled" : "")
          }
          onClick={() => {
            let martrixNameToSave = newMatrixName;
            if (!martrixNameToSave) {
              martrixNameToSave = matrixName;
            }
            handleAction(action, toggleModal, isBi, martrixNameToSave, dateValue);
            // setNewMatrixName("");
          }}
        >
          {modalAction[action]}
        </button>
      </div>
    </Modal>
  );
};

export default SaveModal;
