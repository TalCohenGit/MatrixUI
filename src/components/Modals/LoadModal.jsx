import React from "react";
import Modal from "../../common/components/Modal/Modal";
import SearchMatrixes from "../SearchMatrixes";
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
  loadTablesByID,
  modalHeader,
  noResults,
  Component
}) => {
  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={modalHeader}>
      <div className="LoadModal">
        <h3>בחירת טווח תאריכים</h3>
        <DateRangePickerToLoad
          dateRanges={dateRanges}
          setDateRanges={setDateRanges}
        />
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button className="save-button" onClick={() => onSearch()}>
          חיפוש
        </button>
      </div>
       {Component}
    </Modal>
  );
};

export default LoadModal;
