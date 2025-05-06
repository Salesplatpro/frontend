import React, { useEffect, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import RichTextDisplay from '../../../components/global/RichTextDisplay'
import Loading from '../../../components/Loading/Loading'
import { ShareOptions } from '../../../components/ShareOption/ShareOptions'
import { useIndividualJobQuery } from '../../../redux/api/talent'
import { RootState } from '../../../redux/store/store'
import { capitalizeFirstWord, JobProfileProps } from '../../../utils'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import { notify } from '../../../utils/toastNotifications'
import ShareJobModal from '../../TalentProfile/Job/ShareJobModal'

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

  if (isLoading) return <Loading />

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
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your role at {''} {jobProfile?.postedBy?.firstName} {''}{' '}
                {jobProfile?.postedBy?.lastName}
              </h5>
              <RichTextDisplay
                content={jobProfile?.jobBrief || ' '}
                className="text-[#667085] text-base mt-0 text-justify"
              />
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Requirements
              </h5>
              <RichTextDisplay
                content={jobProfile?.requirements || ' '}
                className="text-[#667085] text-base mt-0 text-justify"
              />
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Skills
              </h5>
              {jobProfile?.skills && (
                <ul className="list-disc ml-5 pl-0">
                  {jobProfile?.skills.map((item, i) => (
                    <li key={i} className="text-[#667085] text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Goals
              </h5>
              {jobProfile?.goals && (
                <ul className="list-disc ml-5 pl-0">
                  {jobProfile?.goals.map((item, i) => (
                    <li key={i} className="text-[#667085] text-base">
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
                <p className="text-[#667085] text-sm text-start font-medium">
                  Job Type
                </p>
                <h5 className="text-[#101828] text-base text-start font-semibold">
                  {capitalizeFirstWord(jobProfile?.workMode)}
                </h5>
              </div>
              <div className="mt-4">
                <p className="text-[#667085] text-sm text-start font-medium">
                  Location
                </p>
                <h5 className="text-[#101828] text-base text-start font-semibold">
                  {jobProfile?.location &&
                    capitalizeFirstWord(jobProfile?.location?.country)}{' '}
                  {''}
                  {jobProfile?.location?.city &&
                    capitalizeFirstWord(jobProfile?.location?.city)}
                </h5>
              </div>
              <div className="mt-4">
                <p className="text-[#667085] text-sm text-start font-medium">
                  Experience Level
                </p>
                <h5 className="text-[#101828] text-base text-start font-semibold">
                  {capitalizeFirstWord(jobProfile?.experienceLevel)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ShareJobModal onClose={closeModal} shareLinks={shareLinks} />
      )}
    </div>
  )
}

export default PostedJob
