import React, { useState, useEffect } from 'react'
import { getRole } from '../api/api-communication'
import { Role } from '../../utils/types'

const Roles = ({ value, onChange }) => {
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRole()
        setRoles(data.data)
      } catch (error) {
        console.log('error fetching role', error)
      }
    }
    fetchRoles()
  }, [])


  return (
    <div>
      <div className="input">
        <select id="role" name="role" value={value} onChange={onChange}>
          <option value="">Select a role...</option>
          {roles.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Roles
