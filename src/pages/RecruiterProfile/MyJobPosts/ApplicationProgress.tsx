import React from 'react'
import { GoTasklist } from 'react-icons/go'
import { SiReaddotcv } from 'react-icons/si'
import { TbEdit } from 'react-icons/tb'
import { useParams } from 'react-router-dom'

import {
  IsProcessing,
  OutlineButton,
  RecruiterButton,
} from '../../../components'
import Loading from '../../../components/Loading/Loading'
import {
  useFetchApplicantProgressQuery,
  useFetchTalentProfileQuery,
} from '../../../redux/api/recruiter'
import { EachProgressDetails } from './EachProgressDetails'
import { ProfileCard } from './ProfileCard'

export const ApplicationProgress = () => {
  const { applicationId } = useParams()
  const iconSize = 32
  const iconColor = ' #4985df'
  const { data, error, isLoading } = useFetchApplicantProgressQuery(
    applicationId ?? '',
  )

  console.log(data)

  const { data: result, isLoading: fetching } = useFetchTalentProfileQuery({
    id: data?.data?.application?.talent?._id,
  })

  const progress = [
    {
      icon: <GoTasklist size={iconSize} color={iconColor} />,
      title: 'Pre-Assessment',
      score: fetching ? (
        <IsProcessing />
      ) : (
        result?.data?.user?.profile?.prescreeningScore ||
        'No pre-assessment test'
      ),
    },
    {
      icon: <SiReaddotcv size={iconSize} color={iconColor} />,
      title: 'CV-Matching',
      score:
        data?.data?.application?.cvSimilarityScore || 'No cv-matching score',
    },
    {
      icon: <TbEdit size={iconSize} color={iconColor} />,
      title: 'Personality Test',
      score:
        data?.data?.application?.personalizedScore || 'No personality test',
    },
  ]

  const personality = {
    icon: <TbEdit size={iconSize} color={iconColor} />,
    title: 'Personalized Test',
    score: data?.data?.application?.mbtiType || 'No personalized test',
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
        firstName={result?.data?.user?.firstName}
        lastName={result?.data?.user?.lastName}
        role={result?.data?.user?.profile?.role[0]?.name}
        description={result?.data?.user?.profile?.role[0]?.description}
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
      <div className="text-center">rank: 2 of 1090 applicants</div>
      <div className="flex justify-center space-x-2">
        <div className="w-1/3">
          <OutlineButton buttonTitle="Reject" />
        </div>
        <div className="w-1/3">
          <RecruiterButton buttonTitle="Shortlist" />
        </div>
      </div>
    </div>
  )
}
