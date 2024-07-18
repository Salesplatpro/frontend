import React, { ReactNode } from "react";
import styles from './Button.module.scss';

type ButtonProps = {
  element?: ReactNode;
  title: string;
  variant?: 'primary' | 'secondary'
}

export const Button = ({ title, element, variant = 'primary' }: ButtonProps) => {
  const isSecondary = variant === 'secondary'
  return (
    <button className={isSecondary ? styles.secondary : styles.primary}>
      {element && <div className={styles.element}>{element}</div>}
      <div>{title}</div>
    </button>
  );
}
