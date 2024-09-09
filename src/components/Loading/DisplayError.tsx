import Lottie from 'lottie-react'
import React from 'react'

import animationData from '../../assets/Animation2.json'

type DisplayErrorType = {
  message: string
}

export const DisplayError = ({ message }: DisplayErrorType) => (
  <div className="flex justify-center items-center flex-col w-full h-full">
    <div>
      <Lottie
        animationData={animationData}
        loop={false}
        className="w-28 h-28 lg:w-44 lg:h-44 md:w-36 md:h-36"
      />
    </div>

    <h2 className="font-raleway font-semibold text-center text-lg lg:text-2xl md:text-xl text-[#4b4b4b] pt-4">
      {message}
    </h2>
  </div>
)
