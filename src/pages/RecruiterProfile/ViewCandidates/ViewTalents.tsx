import React, { useEffect, useState } from 'react'
import { fetchTalentProfies } from '../../../api/api-communication'
import './ViewTalents.scss'
import Roles from '../../../components/Roles'

const ViewTalents = () => {
  const [talentsProfile, setTalentsProfile] = useState([])
  const [roleValue, setRoleValue] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTalentProfies(roleValue);
        setTalentsProfile(data.data.talents)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [roleValue])

  const handleChange = (e) => {
    const val = e.target.value
    setRoleValue(val)
  }

  return (
    <div className="view-container">
      <h2>Talents</h2>
      <div className="view-role">
        <p>Search by roles</p>
        <Roles value={roleValue} onChange={handleChange} />
      </div>
      <div className="view-body">
        {talentsProfile.map((talent, index) => (
          <div key={index} className="view-talent">
            <h3>{`${talent.firstName} ${talent.lastName}`}</h3>
            <p>Role: {talent.profile?.role[0]?.name || 'Role not specified'}</p>
            <p>
              Experience:{' '}
              {talent.profile?.experience || 'Experience not specified'}
            </p>
            <p>Bio: {talent.profile?.bio || 'Bio not specified'}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ViewTalents
