import cn from 'classnames'
import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

import styles from './Select.module.scss'
import { SelectProps } from './types'

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  onCreateOption,
  isLoading,
  placeholder = 'Select an option',
  label,
  name,
  error,
  required,
  disabled,
  height,
  searchable,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((option) => option.value === value)
  const selectedLabel = selectedOption?.label || value || ''

  const filteredOptions =
    searchable && search
      ? options.filter((option) =>
          option.label.toLowerCase().includes(search.trim().toLowerCase()),
        )
      : options

  const trimmedSearch = search.trim()
  const showCreateOption =
    !!onCreateOption &&
    !!trimmedSearch &&
    !options.some(
      (option) => option.label.toLowerCase() === trimmedSearch.toLowerCase(),
    )

  const toggleDropdown = () => {
    if (disabled) return
    setIsOpen((prev) => !prev)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearch('')
  }

  const handleCreate = () => {
    onCreateOption?.(trimmedSearch)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className={styles.container} ref={containerRef}>
      {label && (
        <div className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </div>
      )}
      <button
        type="button"
        name={name}
        className={cn(
          styles.trigger,
          error && styles.error,
          disabled && styles.disabled,
        )}
        style={height ? { height } : undefined}
        onClick={toggleDropdown}
        disabled={disabled}>
        <span className={selectedLabel ? undefined : styles.placeholder}>
          {isLoading ? 'Loading...' : selectedLabel || placeholder}
        </span>
        <span className={styles.arrow}>
          <IoIosArrowDown size={18} />
        </span>
      </button>
      {isOpen && !disabled && (
        <div className={styles.options}>
          {searchable && (
            <input
              type="text"
              className={styles.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
            />
          )}
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={styles.option}
              onClick={() => handleSelect(option.value)}>
              {option.label}
            </div>
          ))}
          {showCreateOption && (
            <div className={styles.option} onClick={handleCreate}>
              Create &quot;{trimmedSearch}&quot;
            </div>
          )}
          {filteredOptions.length === 0 && !showCreateOption && (
            <div className={styles.empty}>No options found</div>
          )}
        </div>
      )}
      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
