import React from "react";
import styles from './CheckBox.module.scss';

type CheckBoxProps = {
  name: string;
  value?: boolean;
  label: string;
}

export const CheckBox = ({ name, value, label}: CheckBoxProps) => (
  <div className={styles.container}>
    <input type="checkbox" id={name} name={name} checked={value} />
    <div className={styles.label}>{label}</div>
  </div>
);
