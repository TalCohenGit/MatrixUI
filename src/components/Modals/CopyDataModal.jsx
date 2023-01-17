import { set } from "lodash";
import React, { useEffect } from "react";
import Modal from "../../common/components/Modal/Modal";

const CopyDataModal = ({
  isOpen,
  toggleModal,
  onCopy,
  modalHeader,
  afterProduce,
  onNewMatrix,
  action,
  matrixName,
  isProduced,
  setNewMatrixName,
  newMatrixName,
  setMatrixName,
}) => {
  const handlePrefixedName = (e) => {
    const saveType = e.target.id;
    if (saveType == "save-new-as" || saveType == "duplicate")
      useNameChecker(matrixName, setNewMatrixName, newMatrixName, isProduced, saveType, onNewMatrix);
  };
  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={modalHeader} action={action}>
      <div className="action-buttons">
        {!afterProduce && (
          <button className="cancel-button" onClick={() => toggleModal(false)}>
            בטל
          </button>
        )}
        <button
          id={"duplicate"}
          className="save-button"
          onClick={(e) => {
            handlePrefixedName(e);
            onCopy();
          }}
        >
          שכפל מטריצה
        </button>
        {afterProduce && (
          <button
            id={"save-new-as"}
            className="save-button"
            onClick={(e) => {
              handlePrefixedName(e);
              //onNewMatrix();
            }}
          >
            צור מטריצה חדשה
          </button>
        )}
      </div>
    </Modal>
  );
};

export default CopyDataModal;

const assignFileVersion = (fileName) => {
  console.log("assignFileName ", { fileName });
  let ctr = "";
  const fileLan = fileName.length;
  if (!fileLan) {
    //  return ""
    ctr = "";
  } else {
    const last9 = fileName.slice(fileLan - 9, fileLan);
    const isDuplicated = last9.slice(0, 7) === "משוכפל_" ? true : false;
    if (!isDuplicated) {
      // return `${fileName} משוכפל_01`

      ctr = `${fileName} משוכפל_01`;
    } else {
      const versionStr = last9.slice(7, 9);
      const newVersionInt = parseInt(versionStr) + 1;

      //return `${fileName.slice(0, fileLan - 9)} משוכפל_0${newVersionInt}`;
      ctr = `${fileName.slice(0, fileLan - 9)} משוכפל_0${newVersionInt}`;
    }
  }
  console.log({ ctr });
  return ctr;
};

export function useNameChecker(matrixName, setNewMatrixName, newMatrixName, isProduced, saveType, onNewMatrix) {
  console.log("useNameChecker ", { matrixName, newMatrixName, saveType, isProduced });

  if (matrixName) {
    console.log({ matrixName, newMatrixName });
    let isNewMatrix = matrixName.slice(0, 10);
    console.log({ isNewMatrix });
    if (
      (saveType == "save-new-as" && matrixName.slice(0, 10) == "מטריצה חדשה") ||
      saveType == "duplicate" ||
      saveType == "onload"
    ) {
      setNewMatrixName(assignFileVersion(matrixName, saveType));
    } else {
      onNewMatrix("מטריצה חדשה לתאריך " + new Date().toLocaleString());
    }
  } else {
    console.log("did not pass");
  }
}
