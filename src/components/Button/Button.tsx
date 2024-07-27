import React, { ReactNode } from 'react'

import styles from './Button.module.scss'

type ButtonProps = {
  element?: ReactNode
  title: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export const Button = ({
  title,
  element,
  variant = 'primary',
  onClick,
}: ButtonProps) => {
  const isSecondary = variant === 'secondary'
  return (
    <button
      type="submit"
      className={isSecondary ? styles.secondary : styles.primary}
      onClick={onClick}>
      {element && <div className={styles.element}>{element}</div>}
      <div>{title}</div>
    </button>
  )
}
