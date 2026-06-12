import React from 'react'

import styles from './TextInput.module.scss'

type TextInputProps = {
  title: string
  name: string
  label: string
  autoComplete: string
  isPassword?: boolean
  placeholder?: string
  required?: boolean
  value?: string | number
  disabled?: boolean
  error?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({
  label,
  title,
  name,
  autoComplete,
  value,
  placeholder,
  disabled,
  required,
  isPassword,
  error,
  onChange,
}: TextInputProps) => {
  const inputType = isPassword ? 'password' : 'text'

  return (
    <div className={styles.container}>
      <div className={styles.label}>
        <label htmlFor={label}>{title}</label>
        {required && <div>*</div>}
      </div>
      <div>
        <input
          type={inputType}
          id={label}
          name={name}
          autoComplete={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={styles.input}
        />
      </div>
      {error && <div className={styles.inputError}>{error}</div>}
    </div>
  )
}
