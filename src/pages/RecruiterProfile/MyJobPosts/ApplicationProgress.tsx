import React, { useEffect, useState } from 'react'
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
  useSendTalentMessageMutation,
} from '../../../redux/api/recruiter'
import { EachProgressDetails } from './EachProgressDetails'
import { Message } from './Message'
import { ProfileCard } from './ProfileCard'

const iconSize = 32
const iconColor = ' #4985df'

interface MessageProps {
  content: string
  application?: string
  recipient: string
}

export const ApplicationProgress = () => {
  const { applicationId } = useParams()
  const talentId = useFetchApplicantProgressQuery(applicationId ?? '')?.data
    ?.data?.application?.talent?._id

  const [loadingShortlist, setLoadingShortlist] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)
  const [sendMessage, setSendMessage] = useState<MessageProps>({
    content: '',
    recipient: '',
    application: applicationId,
  })

  const { data, error, isLoading } = useFetchApplicantProgressQuery(
    applicationId ?? '',
  )
  const [patchApplicationStatus] = usePatchApplicationStatusMutation()
  const [sendTalentMessage, { isLoading: isSending }] =
    useSendTalentMessageMutation()

  useEffect(() => {
    if (talentId) {
      setSendMessage((prevState) => ({
        ...prevState,
        recipient: talentId,
      }))
    }
  }, [talentId])

  const getApplicationDetails = (data: any) => {
    const talent = data?.data?.application?.talent || {}
    const profile = talent.profile || {}
    const application = data?.data?.application || {}

    return {
      firstName: talent.firstName || '',
      lastName: talent.lastName || '',
      bio: profile.bio || '',
      experience: profile.experience || '',
      prescreeningScore: profile.prescreeningScore || 'No pre-assessment test',
      cvSimilarityScore:
        application.cvSimilarityScore || 'No cv-matching score',
      personalizedScore: application.personalizedScore || 'No personality test',
      type: application.mbtiType || 'No personalized test',
    }
  }

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

      setSendMessage((prevState) => ({ ...prevState, content: '' }))
      toast.success(
        `Talent is ${response.data.application.status} successfully`,
      )
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!sendMessage.content.trim()) {
      toast.error('Message can not be empty')
      return
    }
    try {
      await sendTalentMessage({
        data: sendMessage,
      }).unwrap()

      setSendMessage((prevState) => ({ ...prevState, content: '' }))
      toast.success('Message sent successfully')
    } catch (error) {
      console.error('Error sending message:', error)
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
            value={sendMessage.content}
            onChange={(e) =>
              setSendMessage((prevState) => ({
                ...prevState,
                content: e.target.value,
              }))
            }
          />
        </div>
        <RecruiterButton
          buttonTitle={`${isSending ? 'Sending...' : 'Send'}`}
          onClick={handleSendMessage}
          disabled={isSending}
        />
      </div>
    </div>
  )
}
