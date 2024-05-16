import React, { useEffect, useState } from 'react'
import {
  fetchTalentProfies,
  filterTalentProfiles,
} from '../../../api/api-communication'
import './GetTalents.scss'
import Roles from '../../../components/Roles/Roles'
import Loading from '../../../components/Loading/Loading'
import { Link } from 'react-router-dom'

interface GetTalent {
  firstName: string
  lastName: string
  profile?: {
    role?: [{ name: string }]
    experience?: string
    bio?: string
  }
}

const GetTalents = () => {
  const [talentsProfile, setTalentsProfile] = useState<GetTalent[]>([])
  const [roleValue, setRoleValue] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState({
    role: '',
    experience: '',
    minScore: '',
    maxSalary: '',
  })

  useEffect(() => {
    const fetch = async () => {
      const data = await filterTalentProfiles(filter)
      setTalentsProfile(data.data.talents)
      setLoading(false)
    }
    fetch()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFilter({ ...filter, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(filter)

    try {
      const data = await filterTalentProfiles(filter)
      setTalentsProfile(data.data.talents)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="view-container">
      <h2>Get your preferred talents</h2>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="view-role">
            {/* <label htmlFor="rolesearch">Roles</label> */}
            <Roles value={roleValue} onChange={handleChange} />
          </div>
          <div>
            {/* <label htmlFor="experience">Experience</label> */}
            <select
              id="experience"
              name="experience"
              value={filter.experience}
              onChange={handleChange}>
              <option value="">Select experience...</option>
              <option value="senior">Senior</option>
              <option value="intermediate">Intermediate</option>
              <option value="junior">Junior</option>
            </select>
          </div>
          <div>
            {/* <label htmlFor="maxSalary">Max Salary</label> */}
            <input
              type="text"
              name="maxSalary"
              id="maxSalary"
              value={filter.maxSalary}
              onChange={handleChange}
              placeholder="Max Salary"
            />
          </div>
          <div>
            {/* <label htmlFor="minScore">Min Score</label> */}
            <input
              type="text"
              name="minScore"
              id="minScore"
              value={filter.minScore}
              onChange={handleChange}
              placeholder="Min Score"
            />
          </div>
        </div>
        <div className="button">
          <button type="submit">Search</button>
        </div>
      </form>
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
            <Link to={`/recruiterDashboard/individualTalents/${talent._id}`}>
              View More
            </Link>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GetTalents
