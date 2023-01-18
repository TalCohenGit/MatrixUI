import { set } from "lodash";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { nameChecker } from "./Modals/CopyDataModal";
import NoResults from "./NoResults";

const SearchMatrixes = ({ matrixesDetails, loadTablesByID, noResults, isMatrixNames, setNewMatrixName }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState({});
  const [updateName, setUpdateName] = useState(false);
  useEffect(() => {
    console.log("use effect before condition ", matrixesDetails, typeof selectedMatrix);
    if (
      Array.isArray(matrixesDetails) &&
      matrixesDetails?.length > 1 &&
      typeof selectedMatrix != Object &&
      updateName
    ) {
      console.log({ matrixesDetails, selectedMatrix });
      const name = matrixesDetails.filter((matrix) => matrix.matrixID === selectedMatrix)[0].matrixName;
      console.log({ name });
      nameChecker(name, setNewMatrixName, "", true, "onload");
      setUpdateName(true);
    }
  }, [selectedMatrix, updateName]);

  const handleSelect = (e) => {
    setSelectedOption(e);

    setSelectedMatrix(e.value);
    console.log({ selectedOption });
    console.log({ selectedMatrix });
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
        onClick={() => {
          console.log({ selectedMatrix });
          loadTablesByID(selectedMatrix);
          setUpdateName(true);
        }}
      >
        טען מטריצה
      </button>{" "}
    </React.Fragment>
  ) : (
    <div />
  );
};

export default SearchMatrixes;
