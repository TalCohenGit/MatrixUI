import React, { useContext } from 'react'
import DatePicker from '../DatePicker';
import Modal from '../../common/components/Modal/Modal';
import { modalAction, savingAsAction } from "../../utils/constants"
import { DataContext } from "../../context/DataContext";

const SaveModal = ({isOpen, toggleModal, handleAction, action, dateValue,setDateValue, matrixName, setMatrixName}) => {

  return (
     <Modal
        isOpen={isOpen}
        toggleModal={toggleModal}
        modalHeader={"פרטים ל" + modalAction[action]}
      >
        <div className="save-matrix-modal">
        {action === savingAsAction && <input
            style={{width:"100%"}}
            value={matrixName}
            type="text"
            id="matrixName"
            onChange={(e) => {
              setMatrixName(e.target.value)}}
            placeholder="בחר שם למטריצה"
          />}
          <h3>בחר תאריך ערך</h3>
          <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => toggleModal()}>
            בטל
          </button>
          <button className={"save-button" + (action === savingAsAction && !matrixName?.length ? " disabled" : "")} onClick={() => handleAction(action, toggleModal)}>
            {modalAction[action]}
          </button>
        </div>
      </Modal>
    );
  };


  export default SaveModal