import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../../../../components/Loading/Loading'
import {
  useLazyCvMatchQuery,
  useJobPipelineQuery,
} from '../../../../redux/api/talent'
import pretestIcon from '../../../../assets/pretestIcon.webp'
import cvmatchIcon from '../../../../assets/cvmatchIcon.webp'
import personalizedIcon from '../../../../assets/personalizedIcon.webp'
import connectorIcon from '../../../../assets/connectorIcon.webp'
import unconnectorIcon from '../../../../assets/unconnectorIcon.webp'
import { IoReload } from 'react-icons/io5'

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
    return <div>Error loading job progress data</div>
  }

  const progresses = getProgresses(jobProgress)

  return (
    <div>
      <div className="mt-4 mb-8">
        <h2 className="font-bold md:text-3xl text-xl text-[#101828]">
          Progress View
        </h2>
        <p className="text-[20px] font-normal text-[#101828]">
          Your job application pipeline. Track your progress and see where you
          are in the process.
        </p>
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
