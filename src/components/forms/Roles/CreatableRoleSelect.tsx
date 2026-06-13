import React from 'react'
import CreatableSelect from 'react-select/creatable'

import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

interface RoleTypes {
  value: any
  name: string
  onChange: (value: any) => void
  customHeight: string
  isDisabled: boolean
}

const CreatableRoleSelect = ({
  value,
  onChange,
  name,
  customHeight,
  isDisabled = false,
}: RoleTypes) => {
  const { data } = useGetRoleQuery({})

  const roleOptions =
    data?.data.map((role: Role) => ({
      value: role._id,
      label: role.name,
    })) || []

  const handleChange = (selectedOption: any) => {
    if (!selectedOption) {
      onChange('')
      return
    }

    const resultValue = selectedOption.__isNew__
      ? selectedOption.label
      : selectedOption.value

    if (Array.isArray(value)) {
      onChange([resultValue])
    } else {
      onChange(resultValue)
    }
  }

  const customStyles = {
    control: (base: any) => ({
      ...base,
      borderRadius: '6px',
      borderColor: 'var(--color-grey-300)',
      height: customHeight || '42px',
      fontFamily: 'Raleway',
    }),
    input: (base: any) => ({
      ...base,
      color: '#333333',
      fontSize: '16px',
    }),
  }

  const selectedVal = Array.isArray(value) ? value[0] : value
  const selectedOption =
    roleOptions.find(
      (option: { value: any; label: string }) => option.value === selectedVal,
    ) ||
    (typeof selectedVal === 'string' &&
      selectedVal !== '' && {
        label: selectedVal,
        value: selectedVal,
      })

  return (
    <div className="w-full">
      <CreatableSelect
        id="role"
        className="w-full capitalize rounded"
        name={name}
        value={selectedOption || value}
        placeholder="Select or type a role..."
        onChange={handleChange}
        options={roleOptions}
        styles={customStyles}
        isDisabled={isDisabled}
        isClearable
      />
    </div>
  )
}

export default CreatableRoleSelect
