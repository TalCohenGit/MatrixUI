import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Input from "@mui/material/Input";
import { useNavigate, useLocation } from "react-router-dom";
import RegisterConfigUserDetails from "../components/RegisterConfigUserDetails";

const ErpSelect = () => {
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

  const handleNextClick = (event) => {
    event.preventDefault();
    
    navigate("/config",{state:{firstName,lastName,userEmail}});
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
            name="htoken"
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
        className="next-button"
        onClick={(e) => {
          handleNextClick(e);
        }}
      >
        המשך לעמוד הבא
      </button>
      <RegisterConfigUserDetails location={location} />

      {/* {location?.state ? (
        <div className="details-box">
          <p>
            <span>שם : </span>
            {firstName + " " + lastName}
          </p>
          <p>
            <span>כתובת אימייל : </span>
            {userEmail}
          </p>
        </div>
      ) : (
        <div />
      )} */}
    </div>
  );
};

export default ErpSelect;
