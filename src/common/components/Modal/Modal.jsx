import React from "react";
import "./Modal.scss";
import PropTypes from "prop-types";

const Modal = ({ isOpen, toggleModal, children, modalHeader = "" }) => {
  return (
    isOpen && (
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          {" "}
          <div className="modal-header">
            <span
              className="close"
              onClick={(e) => {
                toggleModal(false);
              }}
            >
              &times;
            </span>
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
