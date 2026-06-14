import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

import { TextInput, TextInputProps } from '../TextInput'
import styles from './PasswordInput.module.scss'

type PasswordInputProps = Omit<TextInputProps, 'isPassword'>

export const PasswordInput = (props: PasswordInputProps) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className={styles.container}>
      <TextInput {...props} isPassword={!visible} />
      <button
        type="button"
        className={styles.toggle}
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((prev) => !prev)}>
        {visible ? <FaEye /> : <FaEyeSlash />}
      </button>
    </div>
  )
}
