import React from 'react'

import ProgressBar from '../../../utils/ProgressBar'
interface StatsType {
  infoData: any
}

const ApplicationTracker: React.FC<StatsType> = ({ infoData }) => {
  const allData = [
    {
      trackerName: 'Campaigns',
      amount: infoData?.campaignCount,
      ratio: true,
      completionRatio: infoData?.completionRatio,
      bgColor: '#4884DF',
      textColor: '#fff',
    },
    {
      trackerName: 'Applications',
      amount: infoData?.applicationsCount,
      ratio: false,
      bgColor: '#F4F6F7',
      textColor: '#000',
    },
    {
      trackerName: 'Shortlists',
      amount: infoData?.shortlistCount,
      ratio: false,
      bgColor: '#4884DF',
      textColor: '#fff',
    },
  ]

  return (
    <div className="flex flex-col items-center md:flex-row justify-between gap-5 ">
      {allData.map((info, i) => (
        <div
          key={i}
          style={{
            backgroundColor: info.bgColor,
            color: info.textColor,
          }}
          className="w-[340px] h-[114px] rounded-lg flex justify-between items-center lg:px-10 md:px-7 px-3">
          <div>
            <h6 className="text-sm font-extralight">{info.trackerName}</h6>
            <h6 className="text-lg font-semibold">{info.amount}</h6>
          </div>
          {info.ratio && (
            <ProgressBar
              percentage={info.completionRatio}
              textColor={info.textColor}
              pathColor="#fff"
              trailColor="#72A9E8"
              size={50}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default ApplicationTracker
