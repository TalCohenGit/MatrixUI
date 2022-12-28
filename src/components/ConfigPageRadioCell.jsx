import React, { useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Input from "@mui/material/Input";

const ConfigPageRadioCell = ({
  label,
  value,
  onChange,
  name,
  onInputChange,
  setValue,
}) => {
  const [rangeInput, setRangeInput] = useState({
    warehouse: {
      start: "",
      end: "",
    },
    detailsCode: {
      start: "",
      end: "",
    },
    customersCode: {
      start: "",
      end: "",
    },
  });

  console.log("value", value);

  const handleRangeInput = (e) => {
    const { name: rangeName, value: rangeValue } = e.target;
    setRangeInput({
      ...rangeInput,
      [name]: { ...rangeInput[name], [rangeName]: rangeValue },
    });
  };

  useEffect(() => {
    if (value[name].radio !== "singleChoice") {
      setValue({
        ...value,
        [name]: {
          ...value[name],
          input: `${rangeInput[name].start}-${rangeInput[name].end}`,
        },
      });
    }
  }, [rangeInput]);

  return (
    <>
      <div
       
        className="config-page-range-cell"
      >
        <RadioGroup value={value[name].radio} onChange={onChange} name={name}>
          <FormControlLabel
            value="singleChoice"
            control={<Radio />}
            label="בודד"
          />
          <FormControlLabel value="range" control={<Radio />} label="טווח" />
        </RadioGroup>
        <p>{label}</p>
      </div>
      <div className="config-page-row-table-cell-inputs">
        {value[name].radio === "singleChoice" ? (
          <Input
          style={{ width: "80px" }}
            name={name}
            onChange={onInputChange}
            value={value[name].input}
            type="number"
          />
        ) : (
          <div>
            <Input
              style={{ width: "40px" }}
              name="end"
              onChange={(e) => {
                handleRangeInput(e);
              }}
              type="number"
            />
            &nbsp; -&nbsp;
            <Input
              style={{ width: "40px" }}
              name="start"
              onChange={(e) => {
                handleRangeInput(e);
              }}
              type="number"
            />{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default ConfigPageRadioCell;
