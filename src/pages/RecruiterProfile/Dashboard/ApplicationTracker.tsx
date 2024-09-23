import React from 'react'
import { AnalyzedPercentage } from '../Batching'
import ProgressBar from '../../TalentProfile/ProgressBar'

const infoData = [
  {
    trackerName: 'campaign',
    amount: '1100',
    percentage: 67,
    color: '',
  },
  {
    trackerName: 'campaign',
    amount: '1100',
    percentage: 67,
  },
  {
    trackerName: 'campaign',
    amount: '1100',
    percentage: 67,
  },
]

const ApplicationTracker = () => {
  return (
    <div className="flex justify-between gap-5">
      {infoData.map((info, i) => (
        <div
          key={i}
          className="bg-[#4884DF] w-[340px] h-[114px] rounded-lg flex justify-between items-center lg:px-10 md:px-7 px-3">
          <div>
            <h6 className="text-white text-sm font-medium">
              {info.trackerName}
            </h6>
            <h6 className="text-white text-lg font-semibold">{info.amount}</h6>
          </div>
          <ProgressBar
            percentage={info.percentage}
            textColor="#fff"
            pathColor="#72A9E8"
            trailColor="#F4EBFF"
          />
        </div>
      ))}
    </div>
  )
}

export default ApplicationTracker
