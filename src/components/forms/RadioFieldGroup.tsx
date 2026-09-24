import { ErrorMessage, Field } from 'formik'
import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import styles from './RadioFieldGroup.module.scss'
import { useFieldRequired } from './useFieldRequired'

type RadioFieldOption = {
  value: string
  label: string
}

type RadioFieldGroupProps = {
  name: string
  label: string
  options: RadioFieldOption[]
  /** Defaults to whether the form's Yup schema marks this field required. */
  required?: boolean
  icons?: React.ReactNode
  tooltipContent?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipVariant?: 'dark' | 'light' | 'success' | 'error' | 'info' | 'warning'
}

const RadioFieldGroup = ({
  name,
  label,
  options,
  required,
  icons,
  tooltipContent,
  tooltipPosition = 'bottom',
  tooltipVariant = 'info',
}: RadioFieldGroupProps) => {
  const isRequired = useFieldRequired(name, required)

  return (
    <div
      className={styles.group}
      role="radiogroup"
      aria-labelledby={`${name}-label`}
      aria-required={isRequired || undefined}
      data-field={name}>
      <p className={styles.label} id={`${name}-label`}>
        {label}
        {isRequired && (
          <span className={styles.required} aria-hidden>
            *
          </span>
        )}
      </p>
      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={`${name}${option.value}`}
          className={styles.option}>
          <Field
            type="radio"
            id={`${name}${option.value}`}
            name={name}
            value={option.value}
          />
          <span>{option.label}</span>
        </label>
      ))}

      {icons && (
        <>
          <span data-tooltip-id={`${name}-tooltip`}>{icons}</span>
          <ReactTooltip
            id={`${name}-tooltip`}
            content={tooltipContent}
            place={tooltipPosition}
            variant={tooltipVariant}
            className="tooltip-wrap"
          />
        </>
      )}

      <ErrorMessage name={name}>
        {(message) => (
          <div id={`${name}-error`} className={styles.error} role="alert">
            {message}
          </div>
        )}
      </ErrorMessage>
    </div>
  )
}

export default RadioFieldGroup
