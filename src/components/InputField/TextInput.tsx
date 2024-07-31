import React from 'react'

import styles from './TextInput.module.scss'

type TextInputProps = {
  title: string
  name: string
  label: string
  isPassword?: boolean
  placeholder?: string
  required?: boolean
  value?: string | number
  disabled?: boolean
  error?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextInput = ({
  label,
  title,
  name,
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
