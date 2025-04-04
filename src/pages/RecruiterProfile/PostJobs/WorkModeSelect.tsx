import React from 'react'
import Select, { SingleValue } from 'react-select'

interface WorkModeSelectProps {
  value: string
  onChange: (value: string) => void
  customHeight: string
}

const WorkModeSelect: React.FC<WorkModeSelectProps> = ({
  value,
  onChange,
  customHeight,
}) => {
  const options = [
    { value: 'remote', label: 'Remote' },
    { value: 'onSite', label: 'OnSite' },
    { value: 'hybrid', label: 'Hybrid' },
  ]

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
      placeholder="Select Remote Option"
    />
  )
}

export default WorkModeSelect
