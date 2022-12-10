import React, { useState } from "react";
import Select from "react-select";
import NoResults from "./NoResults";

const SearchMatrixes = ({
  matrixesDetails,
  loadTablesByID,
  noResults,
  isMatrixNames,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState({});

  const handleSelect = (e) => {
    setSelectedOption(e);
    setSelectedMatrix(e.value);
  };

  const options = [];
  if (matrixesDetails) {
    matrixesDetails.forEach((element) => {
      options.push({ value: element.matrixID, label: element.matrixName });
    });
  }

  return noResults ? (
    <NoResults>לא נמצאו מטריצות</NoResults>
  ) : matrixesDetails?.length && isMatrixNames ? (
    <React.Fragment>
      <div className="search-dropdown-wrapper">
        <Select
          defaultValue={selectedOption}
          onChange={(e) => handleSelect(e)}
          options={options}
          placeholder={"בחירה"}
        />
      </div>
      <button
        className={"save-button" + (!selectedOption ? " disabled" : "")}
        onClick={() => loadTablesByID(selectedMatrix)}
      >
        טען מטריצה
      </button>{" "}
    </React.Fragment>
  ) : (
    <div />
  );
};

export default SearchMatrixes;
