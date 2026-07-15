import React from 'react'
import { useNavigate } from 'react-router-dom'

import connectorIcon from '../../../../assets/connectorIcon.webp'
import unconnectorIcon from '../../../../assets/unconnectorIcon.webp'
import { Application, Progress } from '../../utils/type'

interface Props {
  progress: Progress
  jobProgress: Application
  jobId?: string
}

const ProgressItem: React.FC<Props> = ({ progress, jobProgress, jobId }) => {
  const navigate = useNavigate()

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return '#34C759'
      case 'current':
        return '#3C6FD4'
      case 'awaiting':
        return '#FF3B30'
      default:
        return '#E7EDF7'
    }
  }

  const handleNavigate = () => {
    switch (progress.title) {
      case 'Pre-Assessment':
        navigate('/talentDashboard/TalentQuiz', {
          state: { canRetakeAssessment: true },
        })
        break
      case 'Personalized Test':
        navigate(
          `/talentDashboard/applicationPipeline/personalizedTest/${jobId}/${jobProgress.talent}`,
        )
        break
      case 'Personality Test':
        navigate(
          `/talentDashboard/applicationPipeline/personalityTest/${jobId}`,
        )
        break
      default:
        break
    }
  }

  return (
    <div className="flex lg:space-x-6 space-x-3 items-center">
      <img
        src={progress.status === 'completed' ? connectorIcon : unconnectorIcon}
        alt=""
        className="w-8"
      />
      <div className="p-2 bg-grey-50 rounded-lg flex items-center justify-between w-full">
        <div className="flex items-center space-x-6">
          <div className="w-[56px] h-[56px] bg-[#E7EDF7] rounded-full flex items-center justify-center">
            <img src={progress.icon} alt="" />
          </div>
          <h6 className="text-lg font-medium text-grey-900">
            {progress.title}
          </h6>
        </div>
        {progress.status === 'current' &&
        ['Pre-Assessment', 'Personalized Test', 'Personality Test'].includes(
          progress.title,
        ) ? (
          <button
            onClick={handleNavigate}
            className="w-[96px] h-[40px] text-white text-base rounded-lg"
            style={{ backgroundColor: getStatusColor(progress.status) }}>
            Take Test
          </button>
        ) : (
          <button
            className="w-[96px] h-[40px] text-white text-base rounded-lg"
            style={{ backgroundColor: getStatusColor(progress.status) }}>
            {progress.status === 'completed' ? 'Completed' : 'Awaiting'}
          </button>
        )}
      </div>
    </div>
  )
}

export default ProgressItem
