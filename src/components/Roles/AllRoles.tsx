import { Field } from 'formik'
import React from 'react'

import { useGetRoleQuery } from '../../redux/api/talent'
import { Role } from '../../utils/types'

interface RoleTypes {
  value: any
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const AllRoles = ({ value, onChange, name }: RoleTypes) => {
  const { data } = useGetRoleQuery({})

  return (
    <div className="w-full">
      <div className="relative">
        <Field
          as="select"
          id="role"
          multiple={false}
          className="w-full capitalize rounded outline-none focus:none"
          name={name}
          value={value}
          onChange={onChange}>
          <option value="">Select a Role ......</option>
          {data?.data.map((role: Role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </Field>
      </div>
    </div>
  )
}

export default AllRoles
