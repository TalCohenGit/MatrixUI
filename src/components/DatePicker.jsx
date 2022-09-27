import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Calendar } from "react-date-range";

const DatePicker = ({ dateValue, setDateValue }) => {
  const handleChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
