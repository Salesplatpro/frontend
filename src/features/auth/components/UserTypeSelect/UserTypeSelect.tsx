import { FieldProps } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import styles from './UserTypeSelect.module.scss'

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
  meta,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === field.value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = () => setIsOpen((prev) => !prev)

  const handleOptionClick = (option: Option) => {
    setIsOpen(false)
    // Manually set the field value in Formik
    field.onChange({
      target: {
        name: field.name,
        value: option.value,
      },
    })
  }

  const hasError = Boolean(meta?.touched && meta.error)

  return (
    <div
      className={styles.container}
      ref={containerRef}
      data-field={field.name}>
      <div className={styles.label}>{label}</div>
      <button
        type="button"
        id={field.name}
        name={field.name}
        className={`${styles.trigger} ${hasError ? styles.error : ''}`}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-describedby={hasError ? `${field.name}-error` : undefined}>
        <span className={selectedOption ? undefined : styles.placeholder}>
          {selectedOption?.label || 'Choose an option'}
        </span>
        <span className={styles.arrow}>
          <IoIosArrowDown size={18} />
        </span>
      </button>
      {isOpen && (
        <div className={styles.options}>
          {options.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleOptionClick(option)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
      {hasError && typeof meta.error === 'string' && (
        <div
          id={`${field.name}-error`}
          className={styles.errorText}
          role="alert">
          {meta.error}
        </div>
      )}
    </div>
  )
}
