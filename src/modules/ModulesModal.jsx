import React from "react";
import "../common/components/Modal/Modal.scss";
// import { copyMatrixAction } from "../../../utils/constants";

const ModulesModal = ({ isOpen, children }) => {
  return (
    isOpen && (
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">{children}</div>
      </div>
    )
  );
};

ModulesModal.propTypes = {};

export default ModulesModal;
