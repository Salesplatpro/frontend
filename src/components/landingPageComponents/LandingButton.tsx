import cn from 'classnames'
import React from 'react'

import styles from './styles/Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary'
type ButtonProps = {
  title: string
  variant: ButtonVariant
  type?: 'button' | 'submit' | 'reset'
  onClick: () => void
}

export const LandingButton = ({
  title,
  variant,
  type = 'submit',
  onClick,
}: ButtonProps) => {
  const buttonType = variant === 'primary' ? styles.primary : styles.secondary

  return (
    <button
      onClick={onClick}
      type={type}
      className={cn(styles.container, buttonType)}>
      {title}
    </button>
  )
}
