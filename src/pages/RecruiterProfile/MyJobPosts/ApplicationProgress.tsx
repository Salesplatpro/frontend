import React, { useState } from 'react'
import toast from 'react-hot-toast'
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
  usePatchApplicationStatusMutation,
} from '../../../redux/api/recruiter'
import { EachProgressDetails } from './EachProgressDetails'
import { Message } from './Message'
import { ProfileCard } from './ProfileCard'

export const ApplicationProgress = () => {
  const { applicationId } = useParams()
  const iconSize = 32
  const iconColor = ' #4985df'
  const { data, error, isLoading } = useFetchApplicantProgressQuery(
    applicationId ?? '',
  )
  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const { data: result, isLoading: fetching } = useFetchTalentProfileQuery({
    id: data?.data?.application?.talent?._id,
  })

  const [patchApplicationStatus] = usePatchApplicationStatusMutation()

  const handleStatusUpdate = async (status: 'rejected' | 'shortlisted') => {
    if (status === 'rejected') {
      setLoadingReject(true)
    } else {
      setLoadingShortlist(true)
    }

    try {
      const response = await patchApplicationStatus({
        id: applicationId,
        status: { status },
      }).unwrap()

      console.log(response)
      toast.success(
        `Talent is ${response.data.application.status} successfully`,
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      if (status === 'rejected') {
        setLoadingReject(false)
      } else {
        setLoadingShortlist(false)
      }
    }
  }

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
      <div className="flex justify-center"></div>
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
      <div className="flex flex-col justify-center gap-16">
        <div>
          <div className="text-[20px] font-medium">Messages</div>
          <Message />
        </div>
        <div>
          <textarea
            className="border rounded-[10px] border-gray-300 p-4 resize-none w-full sm:max-w-[803px]"
            cols={91}
            rows={5}
            placeholder="Type here..."
          />
        </div>
        <RecruiterButton buttonTitle="Send" />
      </div>
    </div>
  )
}
