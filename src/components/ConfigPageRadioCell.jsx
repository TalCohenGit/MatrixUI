import React from "react";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Input from "@mui/material/Input";

const ConfigPageRadioCell = ({ label, value, onChange, name,onInputChange }) => {
  console.log(name, value[name], label);

  return (
    <>
      <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <RadioGroup value={value.radio} onChange={onChange} name={name}>
          <FormControlLabel
            value="singleChoice"
            control={<Radio />}
            label="בודד"
          />
          <FormControlLabel value="range" control={<Radio />} label="טווח" />
        </RadioGroup>
        <p>{label}</p>
      </div>
      <div>
        {value.radio === "singleChoice" ? (
         <Input name={name} onChange={onInputChange} value={value.input}/>
        ) : (
          <div style={{display:"flex",margin:"10px",justifyContent:"center"}}>
            <Input style={{width:"40px"}} /> - <Input style={{width:"40px"}}/>{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default ConfigPageRadioCell;
