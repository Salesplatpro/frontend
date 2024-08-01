import React, { ReactNode } from 'react'

import styles from './Button.module.scss'

type ButtonProps = {
  element?: ReactNode
  title: string
  variant?: 'primary' | 'secondary'
  textType?: 'big' | 'small' | 'normal'
  onClick?: () => void
}

export const Button = ({
  title,
  element,
  variant = 'primary',
<<<<<<< HEAD
  textType = 'normal',
  onClick,
=======
>>>>>>> f93ef00... new updates
}: ButtonProps) => {
  const isSecondary = variant === 'secondary'
  const textTypeClass = styles[textType] || styles.big

  return (
    <button
      type="submit"
      className={isSecondary ? styles.secondary : styles.primary}
      onClick={onClick}>
      {element && <div className={styles.element}>{element}</div>}
      <div className={`${textTypeClass}`}>{title}</div>
    </button>
  )
}
