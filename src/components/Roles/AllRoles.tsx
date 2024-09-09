import './Roles.scss'

import { Field } from 'formik'
import React from 'react'
import { useGetRoleQuery } from '../../redux/api/talent'
import { Role } from '../../utils/types'

interface RoleTypes {
  value: string
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const AllRoles = ({ value, onChange, name }: RoleTypes) => {
  const { data } = useGetRoleQuery(undefined)

  return (
    <div className="roles-container">
      <div className="input bg-transparent">
        <Field
          as="select"
          id="role"
          className="bg-transparent"
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
