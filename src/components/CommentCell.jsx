import React, { useState } from "react";

const CommentCell = ({ rowIndex, colIndex, data, setData }) => {
    const [comment, setComment] = useState("")
  return (
    <div>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onBlur={() => {
            const currentData = [...data];
            currentData[rowIndex][colIndex] = comment;
            setData(currentData);
          }}/>
    </div>
  )
}

export default CommentCell