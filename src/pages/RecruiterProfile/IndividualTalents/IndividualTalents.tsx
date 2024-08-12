import './IndividualTalents.scss'

import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import { individualTalent } from '../../../api/api-communication'

interface TalentProfile {
  firstName: string
  lastName: string
  profile?: {
    role?: { name: string }[]
    experience?: string
    bio?: string
    score?: number
  }
}

const IndividualTalents = () => {
  const navigate = useNavigate()
  const { talentId } = useParams<{ talentId: string }>()
  const [talentProfile, setTalentProfile] = useState<TalentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (talentId) {
          const data = await individualTalent(talentId)
          setTalentProfile(data.data.user)
          console.log(data.data)
        }
      } catch (err) {
        setError('Error fetching talent profile.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [talentId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!talentProfile) {
    return <div>No talent profile found</div>
  }

  return (
    <div className="view-container">
      <button onClick={() => navigate(-1)} aria-label="Go back">
        <FaArrowLeft />
      </button>
      <h2>Talent Profile</h2>
      <div className="view-body">
        <div className="view-talent">
          <h3>
            Name: {`${talentProfile.firstName} ${talentProfile.lastName}`}
          </h3>
          <p>
            Role:{' '}
            {talentProfile.profile?.role?.[0]?.name || 'Role not specified'}
          </p>
          <p>
            Experience:{' '}
            {talentProfile.profile?.experience || 'Experience not specified'}
          </p>
          <p>Bio: {talentProfile.profile?.bio || 'Bio not specified'}</p>
          <p>
            Assessment Score:{' '}
            {talentProfile.profile?.score !== undefined
              ? talentProfile.profile.score
              : 'Assessment Score not available'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default IndividualTalents
