import React from 'react'
import Select from 'react-select'

import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

interface RoleTypes {
  value: any
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  customHeight: string
}

const AllRoles = ({ value, onChange, name, customHeight }: RoleTypes) => {
  const { data } = useGetRoleQuery({})

  const roleOptions =
    data?.data.map((role: Role) => ({
      value: role._id,
      label: role.name,
    })) || []

  // Handle change in the select dropdown
  const handleChange = (selectedOption: { value: any; label: string }) => {
    onChange(selectedOption.value)
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

  return (
    <div className="w-full">
      <div className="relative ">
        <Select
          id="role"
          className="w-full capitalize rounded"
          name={name}
          value={roleOptions.find(
            (option: { value: any; label: string }) =>
              option.value === value[0],
          )}
          placeholder="select a role...."
          onChange={handleChange}
          options={roleOptions}
          styles={customStyles}
        />
      </div>
    </div>
  )
}

export default AllRoles
