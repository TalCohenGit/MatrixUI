import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterConfigUserDetails from "../components/RegisterConfigUserDetails";
import { initvalidateAPI, setConfigAPI } from "../api";

const ErpSelect = ({axiosPrivate}) => {
  const [value, setValue] = useState("hashvsevet");
  const [inputs, setInputs] = useState({
    hToken: "",
    hServerName: "",
    hDbName: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { firstName, lastName, userEmail } = location.state || {};

  const handleRadioChange = (event) => {
    setValue(event.target.value);
  };

  const handleInputChange = (event) => {
    const { value, name } = event.target;
    setInputs({ ...inputs, [name]: value });
    console.log("inputs", name, value, inputs);
  };

  const nextPageValidation = () => {
    let isValid = false;
    if (value === "hashvsevet") {
      isValid = Object.keys(inputs).every((field) => inputs[field]?.length);
    }

    return isValid;
  };

  const getERPDetails = () => {
    return {
      usserPrivetKey: inputs?.hToken,
      usserServerName: inputs?.hServerName,
      usserDbname: inputs?.hDbName,
    }
  }

  const handleNextClick = async (event) => {
    event.preventDefault();
    const res = await initvalidateAPI(
      axiosPrivate,
      getERPDetails(),
      "conection"
    );
    //if res is ok
    let erpName = "HA"
    if (value !== "hashvsevet") {
      erpName = "RI"
    }
    setConfigAPI(axiosPrivate, {
      accountState: "active",
      ErpConfig: {
        erpName,
        [erpName]:  getERPDetails()
      },
    });
    navigate("/config", {
      state: {
        firstName,
        lastName,
        userEmail,
        from: location
      },
    });
  };

  return (
    <div className="ErpSelect-wrapper">
      <FormControl>
        <FormLabel id="software-select-id">
          באיזו מהתוכנות את/ה משתמש/ת?
        </FormLabel>
        <RadioGroup
          aria-labelledby="software-select-id"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value="hashvsevet"
            control={<Radio />}
            label="חשבשבת"
          />
          <FormControlLabel value="rivhit" control={<Radio />} label="רווחית" />
        </RadioGroup>
      </FormControl>
      {value === "hashvsevet" ? (
        <div className="hashvsevet-inputs">
          <FormLabel>נא למלא את הפרטים הבאים:</FormLabel>
          <Input
            value={inputs.hToken}
            name="hToken"
            onChange={(e) => handleInputChange(e)}
            placeholder="token"
          />
          <Input
            value={inputs.hServerName}
            name="hServerName"
            onChange={(e) => handleInputChange(e)}
            placeholder="Server Name"
          />
          <Input
            value={inputs.hDbName}
            name="hDbName"
            onChange={(e) => handleInputChange(e)}
            placeholder="DateBase Name"
          />
          <FormLabel>
            *ניתן למצוא מידע בקישור הבא &nbsp;&nbsp;
            <a href="https://docs.wizcloud.co.il/docs/connecting-to-wizcloud">
              פרטי כניסה לחשבשבת
            </a>
          </FormLabel>
        </div>
      ) : (
        <div />
      )}
      <button
        className={
          "next-button" + (!nextPageValidation() ? " btnDisabled" : "")
        }
        onClick={(e) => {
          handleNextClick(e);
        }}
      >
        המשך לעמוד הבא
      </button>
      <RegisterConfigUserDetails location={location} />
    </div>
  );
};

export default ErpSelect;
