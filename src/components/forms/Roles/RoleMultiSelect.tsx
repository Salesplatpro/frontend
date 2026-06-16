import React from 'react'

import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

import { MultiSelect } from '../Select'

interface RoleMultiSelectProps {
  name?: string
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  error?: string
  required?: boolean
  label?: string
  height?: string
}

export const RoleMultiSelect: React.FC<RoleMultiSelectProps> = ({
  name,
  value,
  onChange,
  disabled,
  error,
  required,
  label,
  height,
}) => {
  const { data, isLoading } = useGetRoleQuery({})

  const options =
    data?.data?.map((role: Role) => ({
      value: String(role._id),
      label: role.name || '',
    })) || []

  return (
    <MultiSelect
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      placeholder="Select roles..."
      searchable
      disabled={disabled}
      error={error}
      required={required}
      label={label}
      height={height}
    />
  )
}
