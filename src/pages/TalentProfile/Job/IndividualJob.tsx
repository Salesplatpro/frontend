import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
// eslint-disable-next-line no-unused-vars
import { FaCopy, FaFacebook, FaTwitter } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IoIosLink } from 'react-icons/io'
import { Link, useNavigate, useParams } from 'react-router-dom'

import Loading from '../../../components/Loading/Loading'
import { useIndividualJobQuery } from '../../../redux/api/talent'

const shareOptions = [
  {
    icon: <FaFacebook />,
    text: 'Share',
  },
  {
    icon: <FaXTwitter />,
    text: 'Tweet',
  },
  {
    icon: <IoIosLink />,
    text: 'Copy',
  },
]

interface JobProfileProps {
  role?: {
    name: string
  }
  title?: string
  description?: string
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
  // const navigate = useNavigate()
  const [jobProfile, setJobProfile] = useState<JobProfileProps | null>(null)
  const { data, error, isLoading } = useIndividualJobQuery(jobId)

  useEffect(() => {
    if (data) {
      setJobProfile(data.data)
      console.log(data.data)
    }
    if (error) {
      toast.error('DisplayError loading job post')
    }
  }, [data, error])

  if (isLoading) return <Loading />

  return (
    <div className="w-full">
      <div className="w-[96%] mx-auto mt-4">
        <h2 className="font-bold md:text-3xl text-xl">
          {jobProfile?.role && jobProfile?.role?.name} at {jobProfile?.title}
        </h2>
        <div className="flex space-x-5 items-center mt-3">
          {shareOptions.map((option, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center justify-center space-x-2 border border-[#E7E7E9] w-[89px] h-[40px] rounded-lg">
              {option.icon}
              <span>{option.text}</span>
            </div>
          ))}
        </div>

        <div className="flex md:flex-row flex-col justify-between items-start md:w-[90%] w-full mx-auto md:mt-10 mt-6">
          <div className="md:w-[60%] w-full text-start">
            <div className="">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your role at{jobProfile?.title}
              </h5>
              <p className="text-[#667085] text-base mt-0 text-justify">
                {jobProfile?.description}
              </p>
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Responsibilities
              </h5>
              <p className="">
                {jobProfile?.responsibilities && (
                  <ul className="list-disc ml-5 pl-0">
                    {jobProfile?.responsibilities.map((item, i) => (
                      <li key={i} className="text-[#667085] text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Skills
              </h5>
              <p className="">
                {jobProfile?.skills && (
                  <ul className="list-disc ml-5 pl-0">
                    {jobProfile?.skills.map((item, i) => (
                      <li key={i} className="text-[#667085] text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </div>
            <div className="mt-4">
              <h5 className="text-[#101828] text-lg text-start font-semibold">
                Your Goals
              </h5>
              <p className="">
                {jobProfile?.goals && (
                  <ul className="list-disc ml-5 pl-0">
                    {jobProfile?.goals.map((item, i) => (
                      <li key={i} className="text-[#667085] text-base">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </p>
            </div>
            <Link to={`/talentDashboard/applicationPipeline/${jobId}`}>
              <button className="px-3 py-2 md:w-[190px] w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700 md:my-10 mt-4">
                Apply for this position
              </button>
            </Link>
          </div>

          <div className="md:w-[30%] w-full mt-7 md:mt-0">
            <div className="bg-[#F3F6FC] md:w-[260px] w-full rounded-lg px-8 py-8">
              <button
                type="submit"
                className="px-4 py-2 w-full bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                Apply
              </button>
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
                  {jobProfile?.location && jobProfile?.location?.country}{' '}
                  {jobProfile?.location?.city && jobProfile?.location?.city}
                </h5>
              </div>
              <div className="mt-4">
                <p className="text-[#667085] text-sm text-start font-medium">
                  Experience Level
                </p>
                <h5 className="text-[#101828] text-base text-start font-semibold">
                  {jobProfile?.experienceLevel}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ))} */}
    </div>
  )
}

export default IndividualJob
