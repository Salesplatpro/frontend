import './GetMatch.scss'

import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import {
  fetchTalentProfies,
  getTalentMatch,
  getTopTalents,
} from '../../../api/api-communication'
import Loading from '../../../components/Loading/Loading'
import Roles from '../../../components/Roles/Roles'
import TopTalents from '../TopTalents/TopTalents'

interface TalentProfile {
  firstName: string
  lastName: string
  profile?: {
    role?: [{ name: string }]
    experience?: string
    bio?: string
    _id?: string
  }
}

const GetMatch: React.FC = () => {
  const navigate = useNavigate()
  const { jobId } = useParams()
  const [talentsProfile, setTalentsProfile] = useState<TalentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  console.log(jobId)

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        // const data = await getTalentMatch(jobId)
        const data = await getTopTalents(jobId)
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
      <button onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </button>
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
            <Link to={`/recruiterDashboard/individualTalents/${talent?._id}`}>
              View More About this Talent
            </Link>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GetMatch
