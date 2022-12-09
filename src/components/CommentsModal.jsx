import React, { useEffect, useState } from "react";
import Modal from "../common/components/Modal/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/fontawesome-free-solid";
import Select from "react-select";

const CommentsModal = ({
  isOpen,
  toggleModal,
  modalTitle,
  saveComments,
  comments,
  setComments,
  loadOldComments,
  commentsCellOptions,
  onCancel
}) => {
  const initialValue = { selectValue: "", inputValue: "" };

  useEffect(() => {
    loadOldComments();
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
    setComments([...comments, initialValue]);
  };

  const deleteCommentsRow = (index) => {
    const currentComments = [...comments];
    const newComments = [
      ...currentComments.slice(0, index),
      ...currentComments.slice(index + 1),
    ];

    setComments(newComments)
  };

  const getCommentLabel = (commentsOptions, selectValue) => {
    const commentObj = commentsOptions.find(
      (element) => element.value === selectValue
    );
    return commentObj.label;
  };

  const [selectedOption, setSelectedOption] = useState({
    value: "price",
    label: "מחיר",
  });

  const mappedComments = comments.map((comment, index) => {
    return (
      <div className="comments-row" key={comment + index}>
        <Select
          placeholder={
            comment?.selectValue && comment.inputValue?.length
              ? getCommentLabel(commentsCellOptions, comment.selectValue)
              : "בחר מהרשימה..."
          }
          onChange={(e) => handleSelect(e, index, "selectValue")}
          options={commentsCellOptions}
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
        <div onClick={() => deleteCommentsRow(index)} className="plus-button">
          {" "}
          <FontAwesomeIcon icon={faTrash} color="#464d55" size="2x" />
        </div>
      </div>
    );
  });

  return (
    <Modal isOpen={isOpen} toggleModal={toggleModal} modalHeader={modalTitle}>
      <div className="comments" onClick={(e) => e.stopPropagation()}>
      <div onClick={() => addCommentsRow()} className="plus-button">
          {" "}
          <FontAwesomeIcon icon={faPlus} color="#464d55" size="2x" />
        </div>
        <div>{mappedComments}</div>
      </div>
      <div className="action-buttons">
        <button className="cancel-button" onClick={() => onCancel()}>
          בטל
        </button>
        <button
          className="save-button"
          onClick={() => {
            saveComments(comments);
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
