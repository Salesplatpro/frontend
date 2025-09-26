import React from 'react'
import { RiArrowGoBackLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

import errorImage from './assets/errorImage.png'
import { LandingFooter } from './components'

function PageNotFound() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div>
      <div className="min-h-screen flex justify-evenly items-center flex-col-reverse lg:flex lg:flex-row lg:items-center lg:justify-between  md:flex md:items-center md:justify-evenly md:flex-col-reverse sm:flex sm:items-center sm:justify-evenly sm:flex-col-reverse">
        <div className="w-full flex flex-col space-y-2 lg:space-y-12 md:space-y-7 sm:space-y-6 justify-center items-center">
          <h1 className="font-raleway font-semibold text-[30px] lg:text-[100px] leading-[24px] md:text-[60px] sm:text-[50px]">
            404
          </h1>
          <p className="font-raleway font-medium text-[20px] lg:text-[30px] leading-[150%] md:text-[25px] sm:text-[24px]">
            Oops! Page not found
          </p>

          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2
             bg-[#4985DF] border border-[#4985DF] text-white
             text-[18px] font-raleway font-semibold rounded-lg
             px-4 py-3">
            <RiArrowGoBackLine className="w-5 h-5" />
            <span className="text-white text-[18px]">Previous Page</span>
          </button>
        </div>

        <div className="w-full flex flex-col justify-center items-center">
          <img
            src={errorImage}
            alt="error"
            className=" w-[380px] h-[280px] lg:w-[460px] lg:h-[400px] md:w-[400px] md:h-[320px] sm:w-[400px] sm:h-[300px]"
          />
        </div>
      </div>

      <LandingFooter />
    </div>
  )
}

export default PageNotFound
