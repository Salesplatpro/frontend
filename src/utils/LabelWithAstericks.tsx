import React from 'react'

interface Props {
  label: string
  name?: string
  asterick?: boolean
}

const LabelWithAsterisk: React.FC<Props> = ({ label, asterick, name }) => {
  return (
    <label htmlFor={name} className="font-bold text-sm text-[#434144]">
      {label}
      {asterick && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
}

export default LabelWithAsterisk
