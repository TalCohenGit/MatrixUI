import React, {useState} from "react";
import Select from "react-select";

const DropDownMatrixNames = ({ matrixesDetails, loadTablesByID }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMatrix, setSelectedMatrix] = useState({})

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


  return (
    <div>
      <Select
        defaultValue={selectedOption}
        onChange={(e) => handleSelect(e)}
        options={options}
        // styles={customStyles}
        placeholder={"בחירה"}
      />
      <button className="cancel-button" onClick={() => loadTablesByID(selectedMatrix)}>
        טען מטריצה
      </button>
    </div>
  );
};

export default DropDownMatrixNames;
