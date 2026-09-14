import './SearchBox.scss'

import React from 'react'
import { CiSearch } from 'react-icons/ci'

export const SearchBox = () => {
  return (
    <div className="container">
      <CiSearch size={24} />
      <input placeholder="Search" className="input" />
    </div>
  )
}
