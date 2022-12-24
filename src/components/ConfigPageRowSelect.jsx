import React from "react";
import Select from "react-select";

const ConfigPageRow = ({ label, handleChange, selectedOption, options }) => {
  return (
    <div className="config-page-row">
      <p>{label}</p>
      <div className="config-page-row-select-wrapper">
        <Select
          defaultValue={selectedOption}
          onChange={(e) => handleChange(e)}
          options={options}
        />
      </div>
    </div>
  );
};

export default ConfigPageRow;
