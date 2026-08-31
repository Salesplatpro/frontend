import { FormikContext, getIn } from 'formik'
import React, { useContext } from 'react'

import styles from './TextInput.module.scss'

export type TextInputProps = {
  title: string
  name: string
  label: string
  autoComplete?: string
  isPassword?: boolean
  placeholder?: string
  required?: boolean
  value?: string | number
  disabled?: boolean
  error?: string
  type?: React.HTMLInputTypeAttribute
  maxLength?: number
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  id?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
}

const useFieldError = (name: string, explicit?: string): string | undefined => {
  const formik = useContext(FormikContext)
  if (explicit) return explicit
  if (!formik) return undefined
  const touched = getIn(formik.touched, name)
  const error = getIn(formik.errors, name)
  return touched && typeof error === 'string' ? error : undefined
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      title,
      name,
      autoComplete = 'off',
      value,
      placeholder,
      disabled,
      required,
      isPassword,
      error,
      type,
      maxLength,
      inputMode,
      id,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    const fieldError = useFieldError(name, error)
    const inputId = id || name || label
    const errorId = `${inputId}-error`
    const inputType = isPassword ? 'password' : type || 'text'

    return (
      <div className={styles.container} data-field={name}>
        <div className={styles.label}>
          <label htmlFor={inputId}>{title}</label>
          {required && (
            <span className={styles.required} aria-hidden>
              *
            </span>
          )}
        </div>
        <div>
          <input
            ref={ref}
            type={inputType}
            id={inputId}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            value={value}
            maxLength={maxLength}
            inputMode={inputMode}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            aria-invalid={fieldError ? true : undefined}
            aria-describedby={fieldError ? errorId : undefined}
            aria-required={required || undefined}
            className={
              fieldError ? `${styles.input} ${styles.invalid}` : styles.input
            }
          />
        </div>
        {fieldError && (
          <div id={errorId} className={styles.inputError} role="alert">
            {fieldError}
          </div>
        )}
      </div>
    )
  },
)

TextInput.displayName = 'TextInput'
