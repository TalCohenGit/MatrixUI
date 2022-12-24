import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ConfigPageTableRow from "./ConfigPageTableRow";
import ConfigPageRadioCell from "./ConfigPageRadioCell";

const ConfigPageTable = () => {
  //   const [value, setValue] = useState("singleChoice");
  const [value, setValue] = useState({
    warehouse: {radio:"singleChoice",input:null},
    detailsCode:{radio:"singleChoice",input:null},
    customersCode: {radio:"singleChoice",input:null},
  });

  const { warehouse, detailsCode, customersCode } = value;

  console.log("value",value)

  const handleRadioChange = (e) => {
    const { value: newValue, name } = e.target;
    setValue({ ...value, [name]: {...value[name],radio:newValue }});
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
            value={warehouse}
            onChange={handleRadioChange}
            label="מחסן"
            name="warehouse"
            onInputChange={handleInputChange}
          />
        }
      />
      <ConfigPageTableRow
        firstCell={"פריטים"}
        secondCell={
          <ConfigPageRadioCell
            value={detailsCode}
            onChange={handleRadioChange}
            label="קוד מיון"
            name="detailsCode"
            onInputChange={handleInputChange}
          />
        }
      />
      <ConfigPageTableRow
        firstCell={"לקוחות"}
        secondCell={
          <ConfigPageRadioCell
            value={customersCode}
            onChange={handleRadioChange}
            label="קוד מיון"
            name="customersCode"
            onInputChange={handleInputChange}
          />
        }
      />
      <div className="config-page-row"></div>
    </div>
  );
};

export default ConfigPageTable;
