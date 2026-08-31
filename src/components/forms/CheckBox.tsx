import React from 'react'

import styles from './CheckBox.module.scss'

type CheckBoxProps = {
  name: string
  value?: string
  checked?: boolean
  label: string
  color?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const CheckBox = ({
  name,
  value,
  checked,
  color,
  label,
  onChange,
}: CheckBoxProps) => {
  const inputId = value ? `${name}-${value}` : name

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      <label htmlFor={inputId} className={styles.label} style={{ color }}>
        {label}
      </label>
    </div>
  )
}
