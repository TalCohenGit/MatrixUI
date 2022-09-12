import React, {useState} from 'react'
// import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DateRangePickerToLoad = ({dateRanges, setDateRanges}) => {
  console.log("dateRanges",dateRanges)
  
    return (
      <DateRangePicker
        onChange={item => setDateRanges([item.selection])}
        showSelectionPreview={true}
        showDateDisplay={false}
        moveRangeOnFirstSelection={false}
        months={2}
        ranges={dateRanges}
        direction="horizontal"
        className='custom-date-range'
      />
    )
      
}

export default DateRangePickerToLoad