import { Field } from 'formik'
import React from 'react'

import RichTextEditor from './RichTextEditor'
import styles from './TextField.module.scss'

interface TextFieldProps {
  label: string
  name: string
  asterick?: boolean
  placeholder?: string
  type?: string
  MAX_WORDS?: number
  disabled?: boolean
  hint?: string
}

const TextField = ({
  label,
  name,
  placeholder,
  asterick,
  type,
  MAX_WORDS,
  disabled,
  hint,
}: TextFieldProps) => {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {asterick && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
      </label>
      {type === 'textarea' ? (
        <Field name={name}>
          {({
            field,
          }: {
            field: {
              value: string
              onChange: (event: {
                target: { name: string; value: string }
              }) => void
            }
          }) => (
            <RichTextEditor
              id={name}
              value={field.value}
              onChange={(value: string) => {
                field.onChange({ target: { name, value } })
              }}
              placeholder={placeholder}
              maxLength={MAX_WORDS}
            />
          )}
        </Field>
      ) : (
        <Field
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={
            disabled ? `${styles.input} ${styles.disabled}` : styles.input
          }
        />
      )}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export default TextField
