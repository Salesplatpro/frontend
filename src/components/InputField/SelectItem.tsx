import './SelectItem.scss'

import React, { ReactNode } from 'react'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'

type SelectItemProps = {
  toggle?: boolean
  value?: string
  title: string
  disabled?: boolean
  children?: ReactNode
  onClick?: () => void
}

export const SelectItem = ({
  title,
  value,
  toggle,
  disabled,
  children,
  onClick,
}: SelectItemProps) => (
  <div className={`selectItem-container ${disabled ? 'disabled' : ''}`}>
    <div className="content" onClick={onClick}>
      <div className="title">{value ? value : title}</div>
      {toggle ? <SlArrowUp size={14} /> : <SlArrowDown size={14} />}
    </div>
    <div className={`${toggle ? 'display' : 'hide'} children`}>{children}</div>
  </div>
)
