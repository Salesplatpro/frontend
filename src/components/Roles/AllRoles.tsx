import './Roles.scss'

import { Field, Formik } from 'formik'
import React, { useEffect, useState } from 'react'

import { getRole } from '../../api/api-communication'
import { Role } from '../../utils/types'

interface roleTypes {
  value: string[] | undefined
  name: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const AllRoles = ({ value, onChange, name }: roleTypes) => {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRole()
        setRoles(data.data)
      } catch (error) {
        console.log('error fetching roles', error)
      }
    }
    fetchRoles()
  }, [])

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
          {roles.map((role) => (
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
