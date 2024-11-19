import Lottie from 'lottie-react'
import React from 'react'

import animationData from '../../../../assets/Animation2.json'
import { ErrorResponse } from '../../utils/type'

interface Props {
  error: any
}

const ProgressError: React.FC<Props> = ({ error }) => {
  const errorMessage =
    (error?.data as ErrorResponse)?.message || 'An error occurred'

  return (
    <div className="flex justify-center items-center flex-col w-full h-full">
      <Lottie
        animationData={animationData}
        loop={false}
        className="w-28 h-28 lg:w-44 lg:h-44 md:w-36 md:h-36"
      />
      <h2 className="font-raleway font-semibold text-center text-lg lg:text-2xl md:text-xl text-[#4b4b4b] pt-4">
        {errorMessage}
      </h2>
    </div>
  )
}

export default ProgressError
