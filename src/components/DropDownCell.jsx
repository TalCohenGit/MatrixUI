import React, { useState } from 'react'
import Select from 'react-select';


const DropDownCell = ({ dropdownOptions}) => {
    const options = []
    dropdownOptions.map(option => 
        options.push({ value: option, label: option})
    )
    const [selectedOption, setSelectedOption] = useState(null);

  return (
    <div> 
        <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
        />
    </div>
  )
}

export default DropDownCell;
