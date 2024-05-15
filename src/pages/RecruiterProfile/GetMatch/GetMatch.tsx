import React, { useEffect, useState } from 'react'
import {
  fetchTalentProfies,
  getTalentMatch,
} from '../../../api/api-communication'
import './GetMatch.scss'
import Roles from '../../../components/Roles'
import { useParams } from 'react-router-dom'
import Loading from '../../../components/Loading/Loading'

interface TalentProfile {
  firstName: string
  lastName: string
  profile?: {
    role?: [{ name: string }]
    experience?: string
    bio?: string
  }
}

const GetMatch: React.FC = () => {
  const { jobId } = useParams()
  const [talentsProfile, setTalentsProfile] = useState<TalentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  console.log(jobId)

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        const data = await getTalentMatch(jobId)
        if (data.data.talents.length === 0) {
          setError(true)
        } else {
          setTalentsProfile(data.data.talents)
        }
      } catch (error) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTalents()
  }, [])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <div>No talents fit this Job Description</div>
  }

  return (
    <div className="view-containers">
      <h2>Talents that fits the Job description</h2>
      <div className="view-role">
        <p>These Talents are the best fit for your job</p>
      </div>
      <div className="view-body">
        {talentsProfile.map((talent, index) => (
          <div key={index} className="view-talent">
            <h5>Name: {`${talent.firstName} ${talent.lastName}`}</h5>
            <p>
              Role: {talent.profile?.role?.[0]?.name || 'Role not specified'}
            </p>

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

export default GetMatch
