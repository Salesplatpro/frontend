import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

interface WorkTypeOption {
  value: string
  label: string
}

interface WorktypeProps {
  options: WorkTypeOption[]
  initialSelected: { [key: string]: boolean }
  onSelectionChange: (selected: { [key: string]: boolean }) => void
}

const Worktype: React.FC<WorktypeProps> = ({
  options,
  initialSelected,
  onSelectionChange,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: boolean
  }>(initialSelected)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  // Keep in sync with the parent (e.g. a filter form being cleared) —
  // this is otherwise an uncontrolled component after the initial mount.
  useEffect(() => {
    setSelectedValues(initialSelected)
  }, [initialSelected])

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev)
  }

  const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
    const updatedValues = {
      ...selectedValues,
      [optionValue]: isChecked,
    }
    setSelectedValues(updatedValues)
    onSelectionChange(updatedValues)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative w-[100%]" ref={dropdownRef}>
      <div
        className="w-full p-2 rounded-lg border border-grey-300 h-[44px] mt-1 cursor-pointer flex justify-between items-center"
        onClick={toggleDropdown}>
        <span className="font-medium text-sm font-raleway">
          {Object.keys(selectedValues)
            .filter((key) => selectedValues[key])
            .map((key) => options.find((option) => option.value === key)?.label)
            .join(', ') || 'Select Work Type'}
        </span>
        <FiChevronDown
          className={`ml-2 transition-transform ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {dropdownOpen && (
        <div className="absolute w-full mt-1 bg-white border border-grey-300 rounded-lg z-10 max-h-[150px] overflow-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="block p-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues[option.value] || false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCheckboxChange(option.value, e.target.checked)
                }
                className="mr-2"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default Worktype
