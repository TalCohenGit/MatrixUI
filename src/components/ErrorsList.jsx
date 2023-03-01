import useClickOutside from "../hooks/useClickOutside";
import React, { useRef, useState } from "react";

const ErrorList = ({ data, setErrorsList }) => {
  const clickRef = useRef(null);
  useClickOutside(clickRef, () =>
    setErrorsList((prev) => {
      return { ...prev, toShow: false };
    })
  );

  return (
    data && (
      <div className="search-list" ref={clickRef}>
        <ul>
          <li>
            <span>חותמת זמן</span> <span>תוכן</span>
          </li>
          {data?.length ? (
            data.map((error) => (
              <li>
                <span>{error.time}</span>
                <span>{error.content}</span>
              </li>
            ))
          ) : (
            <li className="search-list-noMatchFound">
              <p>No match found</p>
            </li>
          )}
        </ul>
      </div>
    )
  );
};

export default ErrorList;
