import React from 'react'
import Select, { SingleValue } from 'react-select'

import { experienceLevel } from '../../../utils'

interface ExperienceLevelSelectProps {
  value: string
  onChange: (value: string) => void
  customHeight: string
  options: { value: string; label: string }[]
}

const ExperienceLevelSelect: React.FC<ExperienceLevelSelectProps> = ({
  value,
  onChange,
  customHeight,
}) => {
  const options = Object.values(experienceLevel).map((value) => ({
    value,
    label: value,
  }))

  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>,
  ) => {
    if (selectedOption) {
      onChange(selectedOption.value) // Pass the value of selected option
    }
  }

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: '6px',
      borderColor: '#D0D5DD',
      height: customHeight || '42px',
      fontFamily: 'Raleway',
    }),
    input: (base: any) => ({
      ...base,
      color: '#333333',
      fontSize: '16px',
    }),
  }

  return (
    <Select
      value={options.find((option) => option.value === value)} // Set the selected value
      onChange={handleChange}
      options={options}
      styles={customStyles}
      placeholder="Select Experience level"
    />
  )
}

export default ExperienceLevelSelect
