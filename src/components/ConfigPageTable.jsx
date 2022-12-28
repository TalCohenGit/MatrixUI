import React, { useState } from "react";
import ConfigPageTableRow from "./ConfigPageTableRow";
import ConfigPageRadioCell from "./ConfigPageRadioCell";

const ConfigPageTable = ({ value, setValue }) => {
 
  const handleRadioChange = (e) => {
    const { value: newValue, name } = e.target;
    setValue({ ...value, [name]: {input:"",radio:newValue }});
  };

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
        firstCell={"פריטים"}
        secondCell={
          <ConfigPageRadioCell
            value={value}
            onChange={handleRadioChange}
            label="מחסן"
            name="warehouse"
            onInputChange={handleInputChange}
            setValue={setValue}
          
          />
        }
      />
      <ConfigPageTableRow
        firstCell={"פריטים"}
        secondCell={
          <ConfigPageRadioCell
            value={value}
            onChange={handleRadioChange}
            label="קוד מיון"
            name="detailsCode"
            onInputChange={handleInputChange}
            setValue={setValue}
          
          />
        }
      />
      <ConfigPageTableRow
        firstCell={"לקוחות"}
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
