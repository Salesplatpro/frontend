import { FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

interface Option {
  value: string
  label: string
}

interface SelectUserType extends FieldProps {
  label: string
  options: Option[]
}

const MultiSelectDropDownMenu: React.FC<SelectUserType> = ({
  label,
  options,
  field,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: boolean
  }>({})

  useEffect(() => {
    // Initialize selectedOptions object based on the field value (expecting an array)
    if (Array.isArray(field.value)) {
      const initialSelected = field.value.reduce((acc: any, value: string) => {
        acc[value] = true
        return acc
      }, {})

      setSelectedOptions(initialSelected)
    } else {
      setSelectedOptions({})
    }
  }, [field.value, options])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option: Option) => {
    const updatedSelectedOptions = {
      ...selectedOptions,
      [option.value]: !selectedOptions[option.value], // Toggle selection state
    }

    setSelectedOptions(updatedSelectedOptions)

    // Manually update Formik's field value
    const selectedValues = Object.keys(updatedSelectedOptions).filter(
      (key) => updatedSelectedOptions[key] === true,
    )

    field.onChange({
      target: {
        name: field.name,
        value: selectedValues, // Pass only the selected (true) options
      },
    })

    // Log to verify true/false state of each option
    console.log('Selected Options State:', updatedSelectedOptions)
    console.log('Formik Field Value:', selectedValues)
  }

  return (
    <div className="relative inline-block w-full">
      <div className="mb-2 text-[14px] font-raleway font-medium">{label}</div>
      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-2 text-left text-gray-600 bg-white border rounded-lg focus:outline-none"
          onClick={toggleDropdown}>
          {Object.keys(selectedOptions).filter((key) => selectedOptions[key])
            .length > 0
            ? Object.keys(selectedOptions)
                .filter((key) => selectedOptions[key])
                .map(
                  (key) =>
                    options.find((option) => option.value === key)?.label,
                )
                .join(', ')
            : 'Choose options'}

          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <IoIosArrowDown size={18} color="black" />
          </span>
        </button>
        {isOpen && (
          <div className="absolute w-full mt-2 bg-[#3C6FD4] text-white border rounded-lg shadow-lg z-10">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 hover:bg-[#4985df] cursor-pointer ${
                  selectedOptions[option.value] ? 'bg-[#4985df]' : ''
                }`}
                onClick={() => handleOptionClick(option)}>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelectDropDownMenu
