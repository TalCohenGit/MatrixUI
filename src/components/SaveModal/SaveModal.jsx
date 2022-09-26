import React from 'react'
import DatePicker from '../DatePicker';
import Modal from '../../common/components/Modal/Modal';

const SaveModal = ({isOpen, cancelSave, handleAction, action,savedMatrixName, setSavedMatrixName,dateValue,setDateValue}) => {
    return (
     <Modal
        isOpen={isOpen}
        toggleModal={cancelSave}
        modalHeader="פרטים לשמירה"
      >
        <div className="save-matrix-modal">
          <input
            style={{width:"100%"}}
            value={savedMatrixName}
            type="text"
            id="matrixName"
            onChange={(e) => {
              setSavedMatrixName(e.target.value)}}
            placeholder="בחר שם למטריצה"
          />
          <h3>בחר תאריך ערך</h3>
          <DatePicker dateValue={dateValue} setDateValue={setDateValue} />
        </div>
        <div className="action-buttons">
          <button className="cancel-button" onClick={() => cancelSave()}>
            בטל
          </button>
          <button className={"save-button" + (savedMatrixName?.length ? "" : " disabled")} onClick={() => handleAction()}>
            {action}
          </button>
        </div>
      </Modal>
    );
  };


  export default SaveModal