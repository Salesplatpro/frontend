import Lottie from 'lottie-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { IoMdInformationCircleOutline } from 'react-icons/io'
// import { IoReload } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'

import animationData from '../../../../assets/Animation2.json'
import connectorIcon from '../../../../assets/connectorIcon.webp'
import cvmatchIcon from '../../../../assets/cvmatchIcon.webp'
import personalizedIcon from '../../../../assets/personalizedIcon.webp'
import pretestIcon from '../../../../assets/pretestIcon.webp'
import unconnectorIcon from '../../../../assets/unconnectorIcon.webp'
import Loading from '../../../../components/Loading/Loading'
import {
  useJobPipelineQuery,
  useLazyCvMatchQuery,
} from '../../../../redux/api/talent'
import ProgressBar from '../../ProgressBar'

// Type definitions
interface Application {
  currentStage: string
  stages: { [key: string]: string }
  talent: string
}

interface Progress {
  icon: string
  title: string
  status: string
}

// Create a progress array
const getProgresses = (application: Application): Progress[] => {
  const stagesMapping = {
    prescreening: { icon: pretestIcon, title: 'Pre-Assessment' },
    cv_similarity: { icon: cvmatchIcon, title: 'CV-Matching' },
    personalized: { icon: personalizedIcon, title: 'Personalized Test' },
    personality: { icon: personalizedIcon, title: 'Personality Test' },
  }

  const progresses: Progress[] = []
  const stages = Object.keys(application.stages)
  let currentStage = application.currentStage
  let currentStageFound = false

  stages.forEach((stage) => {
    if (stagesMapping[stage]) {
      let status
      if (stage === currentStage) {
        status = 'current'
        currentStageFound = true
      } else if (!currentStageFound) {
        status = 'completed'
      } else {
        status = 'awaiting'
      }
      progresses.push({
        icon: stagesMapping[stage].icon,
        title: stagesMapping[stage].title,
        status: status,
      })
    }
  })

  return progresses
}

// Get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return '#34C759' // Green for completed stages
    case 'current':
      return '#3C6FD4' // Yellow for current stage
    case 'awaiting':
      return '#FF3B30' // Red for awaiting stages
    default:
      return '#E7EDF7' // Default color
  }
}

const ProgressView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const [jobProgress, setJobProgress] = useState<Application | null>(null)

  const {
    data: applications,
    error: applicationError,
    isLoading: applicationLoading,
  } = useJobPipelineQuery(jobId || '')

  const [
    triggerCvMatch,
    { data: cvMatchData, error: cvMatchError, isLoading: cvMatchLoading },
  ] = useLazyCvMatchQuery()

  useEffect(() => {
    if (applications) {
      toast.success(applications.message)
      const applicationData = applications.data?.application || null
      setJobProgress(applicationData)

      if (applicationData?.currentStage === 'cv_similarity') {
        triggerCvMatch(jobId)
        window.location.reload()
      }
    }

    if (applicationError) {
      toast.error('Error loading application data')
    }
  }, [applications, applicationError, jobId, triggerCvMatch])

  if (applicationLoading || cvMatchLoading) return <Loading />

  if (!jobProgress) {
    return (
      <div className="flex justify-center items-center flex-col w-full h-full">
        <div>
          <Lottie
            animationData={animationData}
            loop={false}
            className="w-28 h-28 lg:w-44 lg:h-44 md:w-36 md:h-36"
          />
        </div>

        <h2 className="font-raleway font-semibold text-center text-lg lg:text-2xl md:text-xl text-[#4b4b4b] pt-4">
          Error loading job progress data
        </h2>
      </div>
    )
  }

  const progresses = getProgresses(jobProgress)

  // Calculate the percentage of completed stages
  const completedStages = progresses.filter(
    (progress) => progress.status === 'completed',
  ).length
  const totalStages = progresses.length
  const progressPercentage = Math.round((completedStages / totalStages) * 100)

  return (
    <div>
      <div className="mt-4 mb-8 px-4">
        <h2 className="font-bold md:text-3xl text-xl text-[#101828]">
          Progress View
        </h2>
        <p className="text-[20px] font-normal text-[#101828]">
          Your job application pipeline. Track your progress and see where you
          are in the process.
        </p>
      </div>
      <div className="bg-[#FFF8EF] w-[95%] h-[70px] my-6 ml-4 px-8 py-11 flex justify-between items-center rounded-xl">
        <div className="flex justify-center items-center space-x-3">
          <IoMdInformationCircleOutline size={27} color="#FF9500" />

          <h1 className="font-raleway text-[14px] leading-[20px] lg:text-[20px] lg:leading-[28px] md:text-[18px] md:leading-[20px] sm:text-[16px] font-semibold text-[#FF9500]">
            {jobProgress?.currentStage === 'completed'
              ? 'Application Assessment completed'
              : 'Application Assessment in progress'}
          </h1>
        </div>

        <ProgressBar
          percentage={progressPercentage}
          textColor="#344054"
          pathColor="#FF9500"
          trailColor="#f8ddba"
        />
      </div>

      <div>
        <div className="max-w-[788px] space-y-2 mx-auto">
          {progresses.map((progress, i) => (
            <div key={i} className="flex lg:space-x-6 space-x-3 items-center">
              <img
                src={
                  progress.status === 'completed'
                    ? connectorIcon
                    : unconnectorIcon
                }
                alt=""
                className="w-8"
              />
              <div className="p-2 bg-[#F8F8F8] rounded-lg flex items-center justify-between w-full">
                <div className="flex items-center space-x-6">
                  <div className="w-[56px] h-[56px] bg-[#E7EDF7] rounded-full flex items-center justify-center">
                    <img src={progress.icon} alt="" />
                  </div>
                  <h6 className="text-[18px] font-medium text-[#101828]">
                    {progress.title}
                  </h6>
                </div>
                {progress.status === 'current' &&
                (progress.title === 'Pre-Assessment' ||
                  progress.title === 'Personalized Test' ||
                  progress.title === 'Personality Test') ? (
                  <Link
                    to={
                      progress.title === 'Pre-Assessment'
                        ? `/talentDashboard/TalentQuiz`
                        : `/talentDashboard/applicationPipeline/${
                            progress.title === 'Personalized Test'
                              ? `personalizedTest/${jobId}/${jobProgress.talent}`
                              : `personalityTest/${jobId}`
                          }`
                    }>
                    <button
                      className="w-[96px] h-[40px] text-white text-base rounded-lg"
                      style={{
                        backgroundColor: getStatusColor(progress.status),
                      }}>
                      Take Test
                    </button>
                  </Link>
                ) : (
                  <button
                    className="w-[96px] h-[40px] text-white text-base rounded-lg"
                    style={{
                      backgroundColor: getStatusColor(progress.status),
                    }}>
                    {progress.status === 'completed' ? 'Completed' : 'Awaiting'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressView
