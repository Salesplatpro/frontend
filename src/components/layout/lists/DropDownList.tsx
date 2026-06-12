import './DropDownList.scss'

import React, { ReactNode, useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

type DropDownListProps = {
  title: string
  children?: ReactNode
}

export const DropDownList = ({ title, children }: DropDownListProps) => {
  const [toggle, setToggle] = useState(false)

  return (
    <div className="dropdown-container">
      <div className="content" onClick={() => setToggle(!toggle)}>
        <div className="title">{title}</div>
        {toggle ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
      </div>
      <div className={`${toggle ? 'display' : 'hide'}`}>{children}</div>
    </div>
  )
}
