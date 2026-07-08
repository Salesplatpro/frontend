import React from 'react'
import { useNavigate } from 'react-router-dom'

import salesplarLogo from '@/assets/Salesplat.png'

interface ResultCardProps {
  variant: 'profileIncomplete' | 'completed'
  score?: number
  attemptsUsed?: number
  attemptsRemaining?: number
  onRetake?: () => void
  isRetaking?: boolean
}

const ResultCard: React.FC<ResultCardProps> = ({
  variant,
  score,
  attemptsUsed,
  attemptsRemaining,
  onRetake,
  isRetaking,
}) => {
  const navigate = useNavigate()

  if (variant === 'profileIncomplete') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-grey-200 p-10 text-center max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-grey-900 font-raleway mb-3">
          Complete your profile before taking the pre-assessment.
        </h2>
        <p className="text-grey-500 font-raleway mb-8">
          Your assessment is generated from your profile, CV, skills,
          experience, and selected roles.
        </p>
        <button
          type="button"
          onClick={() => navigate('/talentDashboard/talentProfile')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-raleway font-medium hover:bg-blue-600 transition-colors">
          Complete Profile
        </button>
      </div>
    )
  }

  const hasAttemptsRemaining =
    typeof attemptsRemaining === 'number' && attemptsRemaining > 0

  return (
    <div className="relative bg-white rounded-2xl border border-grey-200 p-10 max-w-lg mx-auto">
      <img
        src={salesplarLogo}
        alt="Salesplat"
        className="absolute top-6 right-6 h-8 object-contain"
      />

      <div className="flex flex-col items-center text-center">
        <span className="text-4xl mb-4">🎉</span>
        <h2 className="text-2xl font-bold text-grey-900 font-raleway mb-6">
          Assessment Completed
        </h2>

        <div className="w-full flex flex-col gap-3 mb-8">
          {typeof score === 'number' && (
            <div className="flex justify-between items-center bg-grey-50 rounded-xl px-5 py-3">
              <span className="text-grey-600 font-raleway font-medium">
                Score
              </span>
              <span className="text-grey-900 font-bold font-raleway">
                {score}%
              </span>
            </div>
          )}
          {typeof attemptsUsed === 'number' && (
            <div className="flex justify-between items-center bg-grey-50 rounded-xl px-5 py-3">
              <span className="text-grey-600 font-raleway font-medium">
                Attempts used
              </span>
              <span className="text-grey-900 font-bold font-raleway">
                {attemptsUsed}
              </span>
            </div>
          )}
          {typeof attemptsRemaining === 'number' && (
            <div className="flex justify-between items-center bg-grey-50 rounded-xl px-5 py-3">
              <span className="text-grey-600 font-raleway font-medium">
                Attempts remaining
              </span>
              <span className="text-grey-900 font-bold font-raleway">
                {attemptsRemaining}
              </span>
            </div>
          )}
        </div>

        {hasAttemptsRemaining ? (
          <button
            type="button"
            onClick={onRetake}
            disabled={isRetaking}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-raleway font-medium hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {isRetaking ? 'Starting...' : 'Retake Assessment'}
          </button>
        ) : (
          <p className="text-grey-500 font-raleway text-sm">
            You have used all available assessment attempts for your current
            role selection.
          </p>
        )}
      </div>
    </div>
  )
}

export default ResultCard
