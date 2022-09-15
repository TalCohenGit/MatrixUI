import React from 'react'
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';

const DateRangePickerToLoad = ({dateRanges, setDateRanges}) => {
  
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