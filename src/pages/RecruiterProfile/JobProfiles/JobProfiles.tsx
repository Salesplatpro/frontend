import React, { useEffect, useState } from 'react'
import { fetchTalentProfies, jobProfiles } from '../../../api/api-communication'
import './JobProfiles.scss'
import Roles from '../../../components/Roles/Roles'
import { Link } from 'react-router-dom'
import Loading from '../../../components/Loading/Loading'

interface JobProfile {
  role?: {
    name: string
    description: string
  }
  experienceLevel: string
  _id: string
}

const JobProfiles = () => {
  const [jobProfile, setJobProfiles] = useState<JobProfile[]>([])
  const [roleValue, setRoleValue] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (roleValue !== null) {
          setLoading(true)
          const data = await jobProfiles(roleValue)
          setJobProfiles(data.data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error Fetching Jobs', error)
        setError(true)
        setLoading(false)
      }
    }

    fetchData()
  }, [roleValue])

  const handleChange = (e: any) => {
    const val = e.target.value
    setRoleValue(val)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>Error fetching data</div>
  }

  //   if (jobProfile.length === 0) {
  //     return <div>No Job posted for this role yet</div>
  //   }

  return (
    <div className="view-container">
      <h2>All Jobs Posted</h2>
      <div className="search-role">
        <p>Search for jobs by roles</p>
        <div className="view-role">
          <Roles value={roleValue} onChange={handleChange} />
        </div>
      </div>
      <div className="view-body">
        {jobProfile.map((job, index) => (
          <div key={index} className="view-job">
            <h3>Role: {`${job?.role?.name}`}</h3>
            <p>
              Description:{' '}
              {job?.role?.description || 'Description not specified'}
            </p>
            <p>
              Experience: {job?.experienceLevel || 'Experience not specified'}
            </p>
            <Link to={`/recruiterDashboard/getMatch/${job._id}`}>
              View best Talents for this role
            </Link>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobProfiles
