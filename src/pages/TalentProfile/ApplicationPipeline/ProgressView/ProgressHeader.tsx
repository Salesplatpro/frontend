import React from 'react'
import ProgressBar from '../../../../utils/ProgressBar'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { Application } from '../../utils/type'


interface HeaderProps {
  progressPercentage: number
  jobProgress: Application
}

const ProgressHeader: React.FC<HeaderProps> = ({
  progressPercentage,
  jobProgress,
}) => {
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
          size={60}
        />
      </div>
    </div>
  )
}

export default ProgressHeader
