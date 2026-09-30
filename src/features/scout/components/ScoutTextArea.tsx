import { useField } from 'formik'
import React from 'react'

import { useFieldRequired } from '@/components/forms/useFieldRequired'

import styles from './ScoutTextArea.module.scss'

export type ScoutTextAreaProps = {
  name: string
  label: string
  /** Explains, in plain language, what to write and why it matters. */
  hint: string
  placeholder?: string
  rows?: number
  maxLength?: number
  required?: boolean
  /** AI-assist chips, rendered under the label. */
  actions?: React.ReactNode
}

/**
 * A plain-text textarea for the scout campaign form.
 *
 * The shared `TextField type="textarea"` renders a rich-text editor, which is wrong
 * here: the job brief and the AI instructions are sent to the model as plain text,
 * so HTML would only have to be stripped back out again.
 */
export const ScoutTextArea = ({
  name,
  label,
  hint,
  placeholder,
  rows = 6,
  maxLength,
  required,
  actions,
}: ScoutTextAreaProps) => {
  const [field, meta] = useField<string>(name)
  const isRequired = useFieldRequired(name, required)
  const hasError = meta.touched && !!meta.error
  const errorId = `${name}-error`
  const hintId = `${name}-hint`
  const length = (field.value ?? '').length

  return (
    <div className={styles.field} data-field={name}>
      <div className={styles.header}>
        <label htmlFor={name} className={styles.label}>
          {label}
          {isRequired && (
            <span className={styles.required} aria-hidden>
              *
            </span>
          )}
        </label>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      <p className={styles.hint} id={hintId}>
        {hint}
      </p>

      <textarea
        {...field}
        id={name}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        value={field.value ?? ''}
        aria-invalid={hasError || undefined}
        aria-required={isRequired || undefined}
        aria-describedby={[hintId, hasError ? errorId : null]
          .filter(Boolean)
          .join(' ')}
        className={[styles.textarea, hasError ? styles.invalid : '']
          .filter(Boolean)
          .join(' ')}
      />

      <div className={styles.footer}>
        {hasError ? (
          <span className={styles.error} id={errorId} role="alert">
            {meta.error}
          </span>
        ) : (
          <span />
        )}
        {maxLength && (
          <span className={styles.counter}>
            {length} / {maxLength}
          </span>
        )}
      </div>
    </div>
  )
}
