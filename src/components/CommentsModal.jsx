import React, { useContext, useEffect, useState } from "react";
import Modal from "../common/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/fontawesome-free-solid";
import Select from "react-select";
import { commentsOptions, numOfColBeforeProducts } from "../utils/constants";
import { DataContext } from "../context/DataContext";

const CommentsModal = ({ isOpen, toggleModal, rowIndex, colIndex, modalTitle }) => {
  const intialValue = { selectValue: "", inputValue: "" };
  const [comments, setComments] = useState([intialValue]);
  const { matrixComments, setMatrixComments} = useContext(DataContext)

  const customStyles = {
    menu: () => ({
      width: 200,
    }),
    container: () => ({
      width: 200,
    }),
  };
  const handleChange = (value, index, key) => {
    const currentComments = [...comments];
    currentComments[index][key] = value;
    setComments(currentComments);
  };

  const handleSelect = (e, index, key) => {
    setSelectedOption(e);
    handleChange(e.value, index, key);
  };

  const addCommentsRow = () => {
    setComments([...comments, intialValue]);
  };
  const [selectedOption, setSelectedOption] = useState({
    value: "price",
    label: "מחיר",
  });

  const mappedComments = comments.map((comment, index) => {
    return (
      <div className="comments-row" key={index}>
        <Select
          placeholder="בחר מהרשימה..."
          onChange={(e) => handleSelect(e, index, "selectValue")}
          options={commentsOptions}
          styles={customStyles}
          isOptionDisabled={(option) =>
            comments.find((comment) => comment.selectValue === option.value)
          }
          isRtl
        />
        <input
          type="text"
          value={comment.inputValue}
          placeholder={"הוסף הערה"}
          onChange={(e) => handleChange(e.target.value, index, "inputValue")}
          dir="rtl"
        />{" "}
      </div>
    );
  });

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={modalTitle}>
      <div className="comments" onClick={(e) => e.stopPropagation()}>
        <div>{mappedComments}</div>
        <div onClick={() => addCommentsRow()} className="plus-button">
          {" "}
          <FontAwesomeIcon icon={faPlus} color="#464d55" size="2x" />
        </div>
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => toggleModal(false)}>
          בטל
        </button>
        <button
          className="save-button"
          onClick={() => {
            const newMatrixComments = [...matrixComments]
            newMatrixComments[rowIndex-1][colIndex-numOfColBeforeProducts] = comments
            setMatrixComments(newMatrixComments)
            toggleModal(false);
          }}
        >
          שמור
        </button>
      </div>
    </Modal>
  );
};

export default CommentsModal;
