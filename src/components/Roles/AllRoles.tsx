import React from 'react'
import Select from 'react-select'

import { useGetRoleQuery } from '../../redux/api/talent'
import { Role } from '../../utils/types'

interface RoleTypes {
  value: any
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const AllRoles = ({ value, onChange, name }: RoleTypes) => {
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

  return (
    <div className="w-full">
      <div className="relative">
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
        />
      </div>
    </div>
  )
}

export default AllRoles
