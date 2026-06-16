import React from 'react'

import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

import { Select } from '../Select'

interface RoleSelectProps {
  name?: string
  value?: string | null
  onChange: (value: string) => void
  creatable?: boolean
  disabled?: boolean
  error?: string
  required?: boolean
  label?: string
  height?: string
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  name,
  value,
  onChange,
  creatable = false,
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
    <Select
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      onCreateOption={
        creatable ? (createdLabel) => onChange(createdLabel) : undefined
      }
      isLoading={isLoading}
      placeholder="Select a role..."
      searchable
      disabled={disabled}
      error={error}
      required={required}
      label={label}
      height={height}
    />
  )
}
