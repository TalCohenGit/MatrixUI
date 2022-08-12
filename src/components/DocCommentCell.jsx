import React, { useState } from "react";
import DocCommentModal from "./DocCommentModal";


const DocCommentCell = ({ rowIndex, colIndex, data, setData }) => {
  const  [isOpen, toggleModal] = useState(false);
  const openModal = () => {
    toggleModal(true) 
  }

  return (
    <div>
        <button className="docComment-button" onClick={openModal}>
         הערות
        </button>
        <DocCommentModal isOpen={isOpen} toggleModal={toggleModal} rowIndex={rowIndex} colIndex={colIndex} data={data} setData={setData}/> 
    </div>
  )
}

export default DocCommentCell