import { FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

interface Option {
  value: string
  label: string
}

interface UserTypeSelectProps extends FieldProps {
  label: string
  options: Option[]
}

export const UserTypeSelect: React.FC<UserTypeSelectProps> = ({
  label,
  options,
  field,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  useEffect(() => {
    // Set the initial selected option based on the field value
    const initialOption = options.find((option) => option.value === field.value)
    if (initialOption) {
      setSelectedOption(initialOption.label)
    } else {
      setSelectedOption(null)
    }
  }, [field.value, options])

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.label)
    setIsOpen(false)
    // Manually set the field value in Formik
    field.onChange({
      target: {
        name: field.name,
        value: option.value,
      },
    })
  }

  return (
    <div className="relative inline-block w-full">
      <div className="mb-2 text-[14px] font-raleway font-medium">{label}</div>
      <div className="relative">
        <button
          type="button"
          className="w-full px-4 py-2 text-left text-gray-600 bg-white border rounded-lg focus:outline-none"
          onClick={toggleDropdown}>
          {selectedOption || 'Choose an option'}

          <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <IoIosArrowDown size={18} color="black" />
          </span>
        </button>
        {isOpen && (
          <div className="absolute w-full mt-2 bg-primary-strong text-white border rounded-lg shadow-lg z-10">
            {options.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2 hover:bg-primary cursor-pointer"
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
