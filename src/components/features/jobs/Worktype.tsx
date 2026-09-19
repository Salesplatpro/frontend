import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

import styles from './Worktype.module.scss'

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
    <div className={styles.wrapper} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleDropdown}>
        <span className={styles.label}>
          {Object.keys(selectedValues)
            .filter((key) => selectedValues[key])
            .map((key) => options.find((option) => option.value === key)?.label)
            .join(', ') || 'Select Work Type'}
        </span>
        <FiChevronDown
          className={`${styles.chevron} ${
            dropdownOpen ? styles.chevronOpen : ''
          }`}
        />
      </div>

      {dropdownOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <label key={option.value} className={styles.option}>
              <input
                type="checkbox"
                checked={selectedValues[option.value] || false}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleCheckboxChange(option.value, e.target.checked)
                }
                className={styles.checkbox}
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
