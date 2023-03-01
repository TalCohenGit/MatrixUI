import React from "react";
import "./Modal.scss";
import {
  copyMatrixAction
} from "../../../utils/constants";

const Modal = ({ isOpen, toggleModal, children, modalHeader = "", action}) => {
  return (
    isOpen && (
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {" "}
          <div className="modal-header">
            {action != copyMatrixAction && <span
              className="close"
              onClick={(e) => {
                toggleModal(false);
              }}
            >
              &times;
            </span>}
            {modalHeader?.length && <h2>{modalHeader}</h2>}
          </div>
          {children}
        </div>
      </div>
    )
  );
};

Modal.propTypes = {};

export default Modal;
