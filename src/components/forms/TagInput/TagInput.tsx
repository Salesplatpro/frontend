import React, { KeyboardEvent, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5'

import styles from './TagInput.module.scss'

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  required?: boolean
  placeholder?: string
  error?: string
  maxTags?: number
  maxLength?: number
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  label,
  required,
  placeholder = 'Type and press Enter to add',
  error,
  maxTags,
  maxLength = 250,
}) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (raw: string) => {
    const tag = raw.trim()
    if (!tag) return
    if (maxLength && tag.length > maxLength) return
    if (maxTags && value.length >= maxTags) return
    if (value.includes(tag)) return
    onChange([...value, tag])
    setInputValue('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1)
    }
  }

  const wrapperClass = [styles.inputWrapper, error ? styles.hasError : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={wrapperClass} role="group" aria-label={label}>
        {value.map((tag, index) => (
          <span key={index} className={styles.tag}>
            <span className={styles.tagLabel} title={tag}>
              {tag}
            </span>
            <button
              type="button"
              className={styles.tagRemove}
              onClick={(e) => {
                e.stopPropagation()
                removeTag(index)
              }}
              aria-label={`Remove ${tag}`}>
              <IoClose />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          aria-label={label}
        />
      </div>

      <span className={styles.hint}>Press Enter to add each item</span>

      {error && <div className={styles.errorText}>{error}</div>}
    </div>
  )
}
