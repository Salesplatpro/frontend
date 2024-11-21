import './SearchBox.scss'

import React from 'react'
import { CiSearch } from 'react-icons/ci'

// type SearchBoxProps = {
//   placeholder: string
//   onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
// }

export const SearchBox = () => {
  return (
    <div className="container">
      <CiSearch size={24} color="#667085" />
      <input placeholder="Search" className="input" />
    </div>
  )
}
