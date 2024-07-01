import { Field, Formik } from 'formik'
import React, { useState, useEffect } from 'react'
import { Role } from '../../utils/types'
import { getRole } from '../../api/api-communication'

const AllRoles = ({ value, onChange, name }) => {
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
      <div className="input">
        <Field
          as="select"
          id="role"
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
