import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Calendar } from "react-date-range";
import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";

const DatePicker = ({ dateValue, setDateValue }) => {
  console.log("dateValue", dateValue)
  const handleChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    dateValue && (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Calendar
            date={new Date(dateValue)}
            onChange={(value) => {
              handleChange(value);
            }}
            className="calendar-save"
          />
        </LocalizationProvider>
      </div>
    )
  );
};

export default DatePicker;
