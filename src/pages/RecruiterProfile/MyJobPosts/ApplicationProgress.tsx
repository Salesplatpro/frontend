import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { GoTasklist } from 'react-icons/go'
import { SiReaddotcv } from 'react-icons/si'
import { TbEdit } from 'react-icons/tb'
import { useParams } from 'react-router-dom'

import { OutlineButton, RecruiterButton } from '../../../components'
import Loading from '../../../components/Loading/Loading'
import {
  useFetchApplicantProgressQuery,
  usePatchApplicationStatusMutation,
} from '../../../redux/api/recruiter'
import { EachProgressDetails } from './EachProgressDetails'
import { getApplicationDetails } from './getApplicationDetails'
import { Messaging } from './Messaging/Messaging'
import { ProfileCard } from './ProfileCard'

const iconSize = 32
const iconColor = ' #4985df'

export const ApplicationProgress = () => {
  const { applicationId } = useParams()
  const talentId = useFetchApplicantProgressQuery(applicationId ?? '')?.data
    ?.data?.application?.talent?._id
  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  const { data, error, isLoading } = useFetchApplicantProgressQuery(
    applicationId ?? '',
  )
  const [patchApplicationStatus] = usePatchApplicationStatusMutation()

  const {
    firstName,
    lastName,
    bio,
    experience,
    prescreeningScore,
    cvSimilarityScore,
    personalizedScore,
    type,
  } = getApplicationDetails(data)

  const progress = [
    {
      icon: <GoTasklist size={iconSize} color={iconColor} />,
      title: 'Pre-Assessment',
      score: prescreeningScore,
    },
    {
      icon: <SiReaddotcv size={iconSize} color={iconColor} />,
      title: 'CV-Matching',
      score: cvSimilarityScore,
    },
    {
      icon: <TbEdit size={iconSize} color={iconColor} />,
      title: 'Personality Test',
      score: personalizedScore,
    },
  ]

  const personality = {
    icon: <TbEdit size={iconSize} color={iconColor} />,
    title: 'Personalized Test',
    score: type,
  }

  const handleStatusUpdate = async (status: 'rejected' | 'shortlisted') => {
    const setLoading =
      status === 'rejected' ? setLoadingReject : setLoadingShortlist
    setLoading(true)

    try {
      const response = await patchApplicationStatus({
        id: applicationId,
        status: { status },
      }).unwrap()

      toast.success(
        `Talent is ${response.data.application.status} successfully`,
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return <div>Error loading job details</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="m-auto max-w-[781px] space-y-5">
      <ProfileCard
        firstName={firstName}
        lastName={lastName}
        role={experience}
        description={bio}
      />
      <div className="flex flex-col space-y-3">
        {progress.map((item, index) => (
          <EachProgressDetails
            key={index}
            title={item.title}
            useScore
            percentage={item.score}
          />
        ))}
        <EachProgressDetails
          title={personality.title}
          percentage={personality.score}
          personality={personality.score}
        />
      </div>
      <div className="text-center">
        rank: {data?.data?.application?.rank} of{' '}
        {data?.data?.application?.job?.noOfApplicants} applicants
      </div>
      <div className="flex justify-center space-x-2">
        <div className="w-1/3">
          <OutlineButton
            buttonTitle={loadingReject ? 'Rejecting...' : 'Reject'}
            onClick={() => handleStatusUpdate('rejected')}
            disabled={loadingReject}
          />
        </div>
        <div className="w-1/3">
          <RecruiterButton
            buttonTitle={loadingShortlist ? 'Shortlisting...' : 'Shortlist'}
            onClick={() => handleStatusUpdate('shortlisted')}
            disabled={loadingShortlist}
          />
        </div>
      </div>
      <div>
        <Messaging applicationId={applicationId} talentId={talentId} />
      </div>
    </div>
  )
}
