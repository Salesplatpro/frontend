import './IndividualTalents.scss'

import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'

import { individualTalent } from '../../../api/api-communication'

const IndividualTalents = () => {
  const navigate = useNavigate()
  const { talentId } = useParams()
  const [talentProfile, setTalentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await individualTalent(talentId)
        setTalentProfile(data.data.user)
        console.log(data.data)
      } catch (err) {
        setError(err)
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
      <button onClick={() => navigate(-1)}>
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
            {talentProfile.profile?.score || 'Assessment Score not Available'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default IndividualTalents
