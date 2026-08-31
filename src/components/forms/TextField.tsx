import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { IoIosInformationCircle } from 'react-icons/io'
import { Tooltip as ReactTooltip } from 'react-tooltip'

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
  tooltip?: string
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
  tooltip,
}: TextFieldProps) => {
  const tooltipId = `${name}-field-tooltip`
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {asterick && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
        {tooltip && (
          <span
            className={styles.tooltipTrigger}
            data-tooltip-id={tooltipId}
            aria-label={tooltip}>
            <IoIosInformationCircle aria-hidden />
          </span>
        )}
      </label>
      {tooltip && (
        <ReactTooltip
          id={tooltipId}
          content={tooltip}
          place="top"
          variant="info"
        />
      )}
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
      <ErrorMessage name={name} component="div" className={styles.error} />
    </div>
  )
}

export default TextField
