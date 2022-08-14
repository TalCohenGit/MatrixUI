import React, { useContext, useEffect, useState } from "react";
import Modal from "../common/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/fontawesome-free-solid";
import Select from "react-select";
import { commentsOptions, numOfColBeforeProducts } from "../utils/constants";
import { DataContext } from "../context/DataContext";

const CommentsModal = ({ isOpen, toggleModal, rowIndex, colIndex, modalTitle, saveComments, comments, setComments, loadOldComments }) => {
  const intialValue = { selectValue: "", inputValue: "" };
  const { matrixComments, setMatrixComments} = useContext(DataContext)

  useEffect(() => {
    loadOldComments()
  }, []);

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

  const getCommentLabel = (commentsOptions, selectValue) => {
    const commentObj = commentsOptions.find(element => element.value === selectValue)
    return commentObj.label
  }

  const [selectedOption, setSelectedOption] = useState({
    value: "price",
    label: "מחיר",
  });

  const mappedComments = comments.map((comment, index) => {
    return (
      <div className="comments-row" key={index}>
        <Select
          placeholder={comment?.selectValue ?  getCommentLabel(commentsOptions, comment.selectValue): "בחר מהרשימה..."}
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
            saveComments(comments)
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
