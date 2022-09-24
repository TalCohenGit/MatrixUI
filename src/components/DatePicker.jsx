import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Calendar } from "react-date-range";

const DatePicker = ({ dateValue, setDateValue }) => {
  const handleChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* <DesktopDatePicker
          inputFormat="MM/DD/YYYY"
          value={dateValue}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        /> */}
        <Calendar
          date={dateValue}
          onChange={(value) => {
            handleChange(value);
          }}
          className="calendar-save"
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePicker;
