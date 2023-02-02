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
  onDataTypeChange,
}) => {
  const [rangeInput, setRangeInput] = useState({
    detailsCode: {
      start: "",
      end: "",
    },
    customersCode: {
      start: "",
      end: "",
    },
  });
  const [multiInput, setMultiInput] = useState("");

  console.log("value", value);

  const handleRangeInput = (e) => {
    const { name: rangeName, value: rangeValue } = e.target;
    setRangeInput({
      ...rangeInput,
      [name]: { ...rangeInput[name], [rangeName]: rangeValue },
    });
  };

  useEffect(() => {
    if (value[name].radio !== "single") {
      setValue({
        ...value,
        [name]: {
          ...value[name],
          input: `${rangeInput[name].start}-${rangeInput[name].end}`,
        },
      });
    }
  }, [rangeInput]);

  let inputToShow;

  switch (value[name].radio) {
    case "single":
      inputToShow = (
        <Input
          style={{ width: "80px" }}
          name={name}
          onChange={onInputChange}
          value={value[name].input}
          type="number"
        />
      );

      break;
    case "range":
      inputToShow = (
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
      );
      break;
    case "multi":
      inputToShow = (
        <Input
          style={{ width: "90%" }}
          name={name}
          onChange={onInputChange}
          value={value[name].input}
          type="text"
          placeholder="0,2,5,20,31 ..."
        />
      );
      break;
    default:
      inputToShow = null;
  }

  const hasDataType = value[name]?.dataType?.length;
  console.log("dddd", value[name].dataType);
  return (
    <>
      <div className="config-page-range-cell">
        <RadioGroup value={value[name].radio} onChange={onChange} name={name}>
          <FormControlLabel value="single" control={<Radio />} label="בודד" />
          <FormControlLabel value="range" control={<Radio />} label="טווח" />
          <FormControlLabel value="multi" control={<Radio />} label="ריבוי" />
        </RadioGroup>
        {!hasDataType && <p>{label}</p>}
        {hasDataType && (
          <RadioGroup
            value={value[name].dataType}
            onChange={onDataTypeChange}
            name={name}
          >
            <FormControlLabel value="sort" control={<Radio />} label="מיון" />
            <FormControlLabel
              value="storage"
              control={<Radio />}
              label="מחסן"
            />
          </RadioGroup>
        )}
      </div>
      <div className="config-page-row-table-cell-inputs">
        {inputToShow}
      </div>
    </>
  );
};

export default ConfigPageRadioCell;
