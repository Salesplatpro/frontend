import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'

import RichTextDisplay from '../../../components/global/RichTextDisplay'
import Loading from '../../../components/Loading/Loading'
import { ShareOptions } from '../../../components/ShareOption/ShareOptions'
import { useIndividualJobQuery } from '../../../redux/api/talent'
import { capitalizeFirstWord } from '../../../utils'
import { capitalizeEachWord } from '../../../utils/CapitalizeWord'
import { notify } from '../../../utils/toastNotifications'
import ShareJobModal from './ShareJobModal'

import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'

interface JobProfileProps {
  role?: {
    name: string
  }
  title?: string
  description?: string
  jobBrief?: string
  requirements?: string
  firstName?: string
  lastName?: string
  responsibilities?: string[]
  skills?: string[]
  goals?: string[]
  remote?: boolean
  location?: {
    country: string
    city?: string
    state?: string
  }
  experienceLevel?: string
}

const IndividualJob = () => {
  const { jobId } = useParams()
  const [jobProfile, setJobProfile] = useState<JobProfileProps | null>(null)
  const { data, error, isLoading } = useIndividualJobQuery(jobId)
  const [isModalOpen, setIsModalOpen] = useState(true)
  const link = `https://auxhr.com/job/postedjob/${jobId}`

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
      notify('error', 'DisplayError loading job post', {
        autoClose: 5000,
        transition: Bounce,
      })
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

    const FacebookshareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      link,
    )}`

    const LinkedInshareUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
      link,
    )}`

    setShareLinks({
      facebook: FacebookshareUrl,
      twitter: TwittershareUrl,
      linkedin: LinkedInshareUrl,
    })
    setIsModalOpen(true)
  }

  return (
    <div className="w-full">
      <div className="w-[96%] mx-auto mt-4">
        <h2 className="font-bold md:text-3xl text-xl">
          {jobProfile?.role && capitalizeEachWord(jobProfile?.role?.name)}
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded">
          Open Modal
        </button>
        <div className="flex space-x-5 items-center mt-3">
          <ShareOptions handleShare={handleShare} jobId={jobId!} />
        </div>

        <div className="flex md:flex-row flex-col justify-between items-start md:w-[90%] w-full mx-auto md:mt-10 mt-6">
          <div className="md:w-[60%] w-full text-start">
            <div className="">
              {/* <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your role at {''} {jobProfile?.firstName} {''}{' '}
                {jobProfile?.lastName}
              </h5> */}
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your role
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
            <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
              <button className="px-3 py-3 md:w-[190px] w-full bg-blue-500 font-raleway font-medium text-nowrap text-white rounded-lg hover:bg-blue-700 md:my-10 mt-4">
                Apply for this position
              </button>
            </Link>
          </div>

          <div className="md:w-[30%] w-full mt-7 md:mt-0">
            <div className="bg-[#F3F6FC] md:w-[260px] w-full rounded-lg px-8 py-8">
              <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
                <button
                  type="submit"
                  className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                  Apply
                </button>
              </Link>
              <div className="mt-4">
                <p className="text-[#667085] text-sm text-start font-medium">
                  Job Type
                </p>
                <h5 className="text-[#101828] text-base text-start font-semibold">
                  {jobProfile?.remote ? 'True' : 'False'}
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
      {/* {isModalOpen && (
        <ShareJobModal shareLinks={shareLinks} />
      )} */}

      <Modal open={isModalOpen} onClose={closeModal} center>
        <h2>Simple centered modal</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
          pulvinar risus non risus hendrerit venenatis. Pellentesque sit amet
          hendrerit risus, sed porttitor quam.
        </p>
      </Modal>
    </div>
  )
}

export default IndividualJob
