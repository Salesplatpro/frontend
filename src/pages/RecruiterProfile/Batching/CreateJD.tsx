import React from 'react'
import { useNavigate } from 'react-router-dom'

const CreateJD = () => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    navigate('upload-cv-in-batch') // Navigate to the cv-upload child route
  }
  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className=" font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Scout
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Upload cv in batch for collective AI assesment
        </p>
      </div>

      <div className="mx-32">
        <form className="flex justify-center items-start lg:w-[700px] md:w-[850px] sm:w-[670px] h-[550px] lg:flex lg:justify-start lg:items-start md:flex md:justify-center md:items-center sm::flex sm:justify-center sm:items-center flex-col rounded-2xl mt-10 ">
          <div className="flex flex-col justify-start items-start">
            <div className="py-3">
              <label
                htmlFor="name"
                className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                Name
              </label>
              <input
                title="Name"
                name="name"
                type="text"
                placeholder="Company  name"
                className="w-[674px] h-[54px] border border-[#D0D5DD] rounded-lg pl-3 font-raleway text-[16px] font-normal leading-[22px] mt-2"
              />
            </div>

            <div className="py-3">
              <label
                htmlFor="name"
                className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                Job Title
              </label>
              <input
                title="Job Title"
                name="JobTitle"
                type="text"
                className="w-[674px] h-[54px] border border-[#D0D5DD] rounded-lg pl-3 font-raleway text-[16px] font-normal leading-[22px] mt-2"
                placeholder="Job Name"
              />
            </div>

            <div className="py-3">
              <label
                htmlFor="name"
                className="text-[#434144] font-raleway font-bold leading-4 text-[16px]">
                Description
              </label>
              <input
                title="Description"
                name="description"
                type="text"
                className="w-[674px] h-[54px] border border-[#D0D5DD] rounded-lg pl-3 font-raleway text-[16px] font-normal leading-[22px] mt-2"
                placeholder="Add Job description here"
              />
            </div>

            <div className="py-3">
              <label
                htmlFor="name"
                className="text-[#434144] font-raleway font-bold leading-4 py-4 text-[16px]">
                Recruiters guide
              </label>
              <input
                title="Recruiters Guide"
                name="RecruitersGuide"
                type="text"
                className="w-[674px] h-[54px] border border-[#D0D5DD] rounded-lg pl-3 font-raleway text-[16px] font-normal leading-[22px] mt-2"
                placeholder="Enter your preferred guide here"
              />
            </div>
            <button
              onClick={handleNavigate}
              className="w-[100px] lg:w-[358px] md:w-[300px] sm:w-[280px] rounded-lg bg-[#3c6fd4] border flex justify-center items-center hover:bg-[#4b82e1] py-3 mt-8">
              <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
                Create
              </p>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateJD
