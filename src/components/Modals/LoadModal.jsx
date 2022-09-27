import React from "react";
import Modal from "../../common/components/Modal/Modal";
import DropDownMatrixNames from "../DropDownMatrixNames";
import DateRangePickerToLoad from "../DateRangePickerToLoad";

const LoadModal = ({
  isOpen,
  toggleModal,
  dateRanges,
  setDateRanges,
  onCancel,
  onSearch,
  isMatrixNames,
  matrixesDetails,
  loadTablesByID
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggleModal={toggleModal}
      modalHeader="טעינה"
    >
      <div className="LoadModal">
        <h3>בחירת טווח תאריכים</h3>
        <DateRangePickerToLoad
          dateRanges={dateRanges}
          setDateRanges={setDateRanges}
        />
        {/* <DatePicker dateValue={toDateValue} setDateValue={setToDateValue} /> */}
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button className="save-button" onClick={() => onSearch()}>
          חיפוש
        </button>
      </div>
      {isMatrixNames && (
        <DropDownMatrixNames
          matrixesDetails={matrixesDetails}
          loadTablesByID={loadTablesByID}
        />
      )}
    </Modal>
  );
};

export default LoadModal;
