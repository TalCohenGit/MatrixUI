import React from "react";
import "../common/components/Modal/Modal.scss";
// import { copyMatrixAction } from "../../../utils/constants";

const IframeModal = ({ isOpen, children }) => {
  return (
    // isOpen && (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content">{children}</div>
    </div>
    // )
  );
};

IframeModal.propTypes = {};

export default IframeModal;
