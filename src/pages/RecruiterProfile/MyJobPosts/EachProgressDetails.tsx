import React from 'react'

import { AnalyzedPercentage } from '../Batching'

type EachProgressProps = {
  title: string
  useScore?: boolean
  percentage: number | string
  personality?: string
}

export const EachProgressDetails = ({
  title,
  useScore = false,
  percentage,
  personality,
}: EachProgressProps) => {
  return (
    <div className="border rounded-md flex justify-between items-center px-[30px] py-[21px]">
      <div className="font-medium w-1/2">{title}</div>
      <hr className="w-[1px] h-[34px] bg-gray-400 border-none" />
      <div className=" w-1/2 justify-center">
        {useScore ? (
          <div className="flex items-center justify-end space-x-4">
            {typeof percentage === 'number' ? (
              <>
                <div className="font-medium">Score:</div>
                <div className="flex items-center space-x-1">
                  <AnalyzedPercentage targetValue={percentage} />
                  <div className="font-light">Match</div>
                </div>
              </>
            ) : (
              <div>{percentage}</div>
            )}
          </div>
        ) : (
          <div className="text-center font-medium">{personality}</div>
        )}
      </div>
    </div>
  )
}
