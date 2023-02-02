import React, { useState } from "react";
import ConfigPageTableRow from "./ConfigPageTableRow";
import ConfigPageRadioCell from "./ConfigPageRadioCell";

const ConfigPageTable = ({ value, setValue }) => {
 
  const handleRadioChange = (e) => {
    const { value: newValue, name } = e.target;
    setValue({ ...value, [name]: {...value[name],input:"",radio:newValue }});
  };

  const handleDataTypeChange = (e) => {
    const { value: newValue, name } = e.target;
    setValue({ ...value, [name]: {...value[name],input:"",dataType:newValue }});
  }

  const handleInputChange = (e) => {
    const { value: newValue, name } = e.target;
    setValue({ ...value, [name]: {...value[name],input:newValue }});
  }
  return (
    <div>
      <ConfigPageTableRow
        firstCell={"הגדרות לסנכרון מידע"}
        secondCell={"מפתח מיון"}
      />
      <ConfigPageTableRow
        firstCell={<p className="row-tag">פריטים</p>}
        secondCell={
          <ConfigPageRadioCell
            value={value}
            onChange={handleRadioChange}
            onDataTypeChange={handleDataTypeChange}
            // label="קוד מיון"
            name="detailsCode"
            onInputChange={handleInputChange}
            setValue={setValue}
          
          />
        }
      />
      <ConfigPageTableRow
        firstCell={<p className="row-tag">לקוחות</p>}
        secondCell={
          <ConfigPageRadioCell
            value={value}
            onChange={handleRadioChange}
            label="קוד מיון"
            name="customersCode"
            onInputChange={handleInputChange}
            setValue={setValue}
        
          />
        }
      />
      <div className="config-page-row"></div>
    </div>
  );
};

export default ConfigPageTable;
