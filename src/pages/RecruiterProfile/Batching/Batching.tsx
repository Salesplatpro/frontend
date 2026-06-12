import React from 'react'
import { useNavigate } from 'react-router-dom'

import CreateJD from '../../../assets/batchImg.png'
// import { DocumentUploaderCard } from '@/components/features/recruiter/Cards'

const Batching = () => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('create-jd') // Navigate to the cv-upload child route
  }

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className="font-raleway text-grey-900 text-[32px] font-bold leading-[37.57px]">
          Scout
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-grey-900">
          Upload CV in batch for collective AI assessment
        </p>
      </div>

      <div>
        <div className=" flex justify-center items-center lg:w-[1100px] md:w-[850px] sm:w-[670px] h-[550px] lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center sm::flex sm:justify-center sm:items-center flex-col bg-grey-50 border border-grey-300 rounded-2xl mt-10">
          <div className="flex justify-center items-center w-[100%] flex-col lg:flex lg:justify-center lg:items-center lg:flex-col md:flex md:justify-center md:items-center sm:flex sm:justify-center sm:items-center space-y-4 relative ">
            <div className="space-y-2 text-center ">
              <h1 className=" font-raleway text-grey-900 text-[20px] leading-[22px] lg:text-[25px]  font-bold lg:leading-[28px]">
                No activity
              </h1>
              <p className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-grey-900">
                Click on create New to add JD
              </p>
            </div>

            <img src={CreateJD} alt="Jd" />

            <button
              onClick={handleNavigate}
              className="w-[250px] lg:w-[358px] md:w-[300px] sm:w-[280px] rounded-lg bg-primary-strong border flex justify-center items-center hover:bg-[#4b82e1] py-3"
            >
              <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
                Create New
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Batching
