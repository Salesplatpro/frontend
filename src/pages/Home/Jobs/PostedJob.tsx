import 'react-responsive-modal/styles.css'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Modal } from 'react-responsive-modal'
import { useNavigate, useParams } from 'react-router-dom'

import { ShareOptions } from '@/components/features/jobs/ShareOption/ShareOptions'
import RichTextDisplay from '@/components/features/shared/global/RichTextDisplay'
import { Spinner } from '@/components/ui/Spinner'

import Facebook from '../../../assets/Facebook icon.svg'
import LinkedIn from '../../../assets/linkedin logo_icon.svg'
import Twitter from '../../../assets/twitter_new_brand_icon.svg'
import { useIndividualJobQuery } from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
import { capitalizeFirstWord, JobProfileProps } from '../../../utils'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import { notify } from '../../../utils/toastNotifications'

const PostedJob = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const [jobProfile, setJobProfile] = useState<JobProfileProps | null>(null)
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const link = `https://auxhr.com/job/postedjob/${jobId}`
  const user = useSelector((state: RootState) => state.auth)
  const userRole = user?.user?.userRole || ' '
  const isLoggedIn = !!user?.token
  console.log(userRole)
  console.log(isLoggedIn)

  const [shareLinks, setShareLinks] = useState<{
    facebook: string
    twitter: string
    linkedin: string
  }>({
    facebook: '',
    twitter: '',
    linkedin: '',
  })

  useEffect(() => {
    if (data) {
      setJobProfile(data.data)
      console.log(data.data)
    }
    if (error) {
      notify('error', 'DisplayError loading job post')
    }
  }, [data, error])

  if (isLoading) return <Spinner fullPage />

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleShare = () => {
    const TwittershareUrl = `https://twitter.com/share?url=${encodeURIComponent(
      link,
    )}`
    const FacebookshareUrl = `https://facebook.com/share?url=${encodeURIComponent(
      link,
    )}`
    const LinkedInshareUrl = `https://linkedin.com/share?url=${encodeURIComponent(
      link,
    )}`

    setShareLinks({
      facebook: FacebookshareUrl,
      twitter: TwittershareUrl,
      linkedin: LinkedInshareUrl,
    })
    setIsModalOpen(true)
  }

  const handleApply = () => {
    if (!jobId) {
      notify('error', 'Invalid job ID')
      return
    }

    if (userRole === 'talent') {
      navigate(`/talentDashboard/job/${jobId}`)
    } else if (!user?.token) {
      sessionStorage.setItem('pending_job_application', jobId ?? '')
      navigate(`/login?from=job_application`)
    }
  }

  const shareOptions = [
    {
      icon: Facebook,
      text: 'Share',
      action: 'share',
      link: shareLinks.facebook,
    },

    {
      icon: Twitter,
      text: 'Tweet',
      action: 'share',
      link: shareLinks.twitter,
    },
    {
      icon: LinkedIn,
      text: 'Share',
      action: 'share',
      link: shareLinks.linkedin,
    },
  ]

  const handleRedirectShare = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full">
      <div className="w-[88%] mx-auto mt-4">
        <h2 className="font-bold md:text-3xl text-xl">
          {jobProfile?.role && capitalizeEachWord(jobProfile?.role?.name)} Job
          Post
        </h2>
        <div className="flex space-x-5 items-center mt-3">
          <ShareOptions handleShare={handleShare} jobId={jobId!} />
        </div>

        <div className="flex md:flex-row flex-col justify-between items-start w-full md:space-x-10 mx-auto md:mt-10 mt-6">
          <div className="w-full text-start">
            <div className="">
              <h5 className="text-grey-900 text-lg text-start font-semibold">
                Your role at {''} {jobProfile?.postedBy?.firstName} {''}{' '}
                {jobProfile?.postedBy?.lastName}
              </h5>
              <RichTextDisplay
                content={jobProfile?.jobBrief || ' '}
                className="text-grey-500 text-base mt-0 text-justify"
              />
            </div>
            <div className="mt-4">
              <h5 className="text-grey-900 text-lg text-start font-semibold">
                Your Requirements
              </h5>
              <RichTextDisplay
                content={jobProfile?.requirements || ' '}
                className="text-grey-500 text-base mt-0 text-justify"
              />
            </div>
            <div className="mt-4">
              <h5 className="text-grey-900 text-lg text-start font-semibold">
                Your Skills
              </h5>
              {jobProfile?.skills && (
                <ul className="list-disc ml-5 pl-0">
                  {jobProfile?.skills.map((item, i) => (
                    <li key={i} className="text-grey-500 text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4">
              <h5 className="text-grey-900 text-lg text-start font-semibold">
                Your Goals
              </h5>
              {jobProfile?.goals && (
                <ul className="list-disc ml-5 pl-0">
                  {jobProfile?.goals.map((item, i) => (
                    <li key={i} className="text-grey-500 text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={handleApply}
              className="px-3 py-2 md:w-[190px] w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 md:my-10 mt-4">
              Apply for this position
            </button>
          </div>

          <div className="md:w-[30%] w-full mt-7 md:mt-0 mx-auto">
            <div className="bg-[#F3F6FC] md:w-[260px] w-full rounded-lg px-8 py-8 mx-auto">
              <button
                onClick={handleApply}
                className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                Apply
              </button>
              <div className="mt-4">
                <p className="text-grey-500 text-sm text-start font-medium">
                  Job Type
                </p>
                <h5 className="text-grey-900 text-base text-start font-semibold">
                  {capitalizeFirstWord(jobProfile?.workMode)}
                </h5>
              </div>
              <div className="mt-4">
                <p className="text-grey-500 text-sm text-start font-medium">
                  Location
                </p>
                <h5 className="text-grey-900 text-base text-start font-semibold">
                  {jobProfile?.location &&
                    // @ts-expect-error TODO: fix type error
                    capitalizeFirstWord(jobProfile?.location?.country)}{' '}
                  {''}
                  {jobProfile?.location?.city &&
                    // @ts-expect-error TODO: fix type error
                    capitalizeFirstWord(jobProfile?.location?.city)}
                </h5>
              </div>
              <div className="mt-4">
                <p className="text-grey-500 text-sm text-start font-medium">
                  Experience Level
                </p>
                <h5 className="text-grey-900 text-base text-start font-semibold">
                  {capitalizeFirstWord(jobProfile?.experienceLevel)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="flex flex-col items-center text-center rounded-lg p-6 max-w-[400px] min-w-[280px] mx-auto">
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-medium font-raleway">
            Select your preferred social media to share job
          </h2>

          <div className="mt-4 w-full">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className="w-full border-[1px] py-3 my-2 rounded-lg font-raleway text-[14px] sm:text-[16px] md:text-[18px] bg-white border-[#E7E7E9] hover:bg-[#e8eaee] flex items-center justify-center"
                onClick={() => handleRedirectShare(option.link)}>
                <img
                  src={option.icon}
                  alt={option.text}
                  className="mr-3 w-[28px] h-[28px] object-contain"
                />
                {option.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PostedJob
