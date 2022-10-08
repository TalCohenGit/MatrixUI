import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/fontawesome-free-solid";

const ArrowButton = ({ rotation, handleClick,direction,showArrow}) => {
  const [style, setStyle] = useState({opacity:"0"});
  return (
    <div
      onMouseEnter={() => {
        if(!showArrow){
          setStyle({visibility:"hidden"})
          return
        }
        setStyle({opacity:"1",cursor:"pointer"})
      }}
      onMouseLeave={() => setStyle({opacity:"0"})}
      style={style}
      className={`ArrowButton-${direction}`}
      onClick={handleClick}
    >
      {""}
      {(
        <span>
          <FontAwesomeIcon
            icon={faChevronLeft}
            color="#464d55"
            rotation={rotation}
          />
        </span>
      )}
    </div>
  );
};

ArrowButton.propTypes = {
  rotation: PropTypes.oneOf([180,0,270]),
  handleClick: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(["left","right"])

};

export default ArrowButton;
