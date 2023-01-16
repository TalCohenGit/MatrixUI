import React, { useEffect, useState } from "react";
import DatePicker from "../DatePicker";
import Modal from "../../common/components/Modal/Modal";
import { modalAction, savingAsAction, savingAction, copyMatrixAction } from "../../utils/constants";
import { set } from "lodash";

const SaveModal = ({ isOpen, toggleModal, handleAction, action, matrixName, isProduced = false }) => {
  console.log({ matrixName, action, isProduced });
  const [isBi, setIsBi] = useState(false);
  const [newMatrixName, setNewMatrixName] = useState("");
  const [dateValue, setDateValue] = useState(new Date());

  useNameChecker(matrixName, setNewMatrixName, newMatrixName, assignFileVersion, isProduced);

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
            setNewMatrixName("");
          }}
        >
          {modalAction[action]}
        </button>
      </div>
    </Modal>
  );
};

export default SaveModal;

const assignFileVersion = (fileName) => {
  const fileLan = fileName?.length;
  if (!fileLan) return "";
  const last9 = fileName.slice(fileLan - 9, fileLan);
  const isDuplicated = last9.slice(0, 7) === "משוכפל_" ? true : false;
  if (!isDuplicated) return `${fileName.slice(0, fileLan - 9)} משוכפל_01`;

  const versionStr = last9.slice(7, 9);
  const newVersionInt = parseInt(versionStr) + 1;

  return `${fileName.slice(0, fileLan - 9)} משוכפל_${newVersionInt}`;
};

export const useNameChecker = (matrixName, setNewMatrixName, newMatrixName, assignFileVersion, isProduced) => {
  useEffect(() => {
    if (matrixName && newMatrixName == "" && isProduced) {
      console.log({ matrixName, newMatrixName });
      setNewMatrixName(assignFileVersion(matrixName));
    }
  }, [matrixName]);
};
