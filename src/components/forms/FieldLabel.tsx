import React from 'react'

import styles from './FieldLabel.module.scss'
import { useFieldRequired } from './useFieldRequired'

type FieldLabelProps = {
  /** The field this labels; also the schema path used to decide required-ness. */
  htmlFor: string
  /** Schema path, when it differs from the control's id. */
  name?: string
  /** Overrides the schema, for forms that validate some other way. */
  required?: boolean
  className?: string
  children: React.ReactNode
}

/** A `<label>` that marks itself required from the form's schema. */
export const FieldLabel = ({
  htmlFor,
  name,
  required,
  className,
  children,
}: FieldLabelProps) => {
  const isRequired = useFieldRequired(name ?? htmlFor, required)

  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
      {isRequired && (
        <span className={styles.required} aria-hidden>
          *
        </span>
      )}
    </label>
  )
}
