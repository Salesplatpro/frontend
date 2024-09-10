import React, { useState } from 'react'
import toast from 'react-hot-toast'
// import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import UploadCheck from '../../../assets/Upload Check.png'
import Uploading from '../../../assets/Uploading.png'
// import DocumentUploaderCard from '../../../components/Cards/DocumentUploaderCard'
import BatchingCv from './BatchingCv'

const UploadBatch = () => {
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [cvFileSize, setCvFileSize] = useState<{
    size: number
    unit: 'MB' | 'KB'
  } | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0] // Get the first file
      setCvFileName(file.name) // Set the file name in state

      let fileSizeInMB: number // Initialize file size variable
      let unit: 'KB' | 'MB'

      if (file.size > 1048576) {
        // File size is greater than 1MB
        fileSizeInMB = file.size / 1024 / 1024 // Convert from bytes to MB
        unit = 'MB'
      } else {
        // File size is less than 1MB, convert to KB
        fileSizeInMB = file.size / 1024 // Convert from bytes to KB
        unit = 'KB'
      }
      setCvFileSize({ size: Number(fileSizeInMB.toFixed(2)), unit })
      toast.success(`File ${file.name} selected successfully`)
    }
  }

  const navigate = useNavigate()

  const handleNavigate = () => {
    if (cvFileName && cvFileSize) {
      navigate('/recruiterDashboard/scout/cv-upload-files', {
        state: {
          fileName: cvFileName,
          fileSize: cvFileSize.size,
          fileUnit: cvFileSize.unit,
        },
      })
    } // Navigate to the cv-upload child route
  }

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2">
        <h1 className=" font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          CV Upload
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Upload cv in batch for collective AI assesment
        </p>
      </div>

      <div className="flex justify-center items-center flex-col py-24">
        <div className="flex justify-center items-center lg:w-[638px] lg:h-[204px] md:w-[850px] sm:w-[670px] h-[204px] lg:flex lg:justify-start lg:items-center md:flex md:justify-center md:items-center sm::flex sm:justify-center sm:items-center flex-col bg-[#F8F8F8] border border-[#D0D5DD] rounded-2xl">
          <div className="flex justify-center items-center w-[100%] flex-col lg:flex lg:justify-center lg:items-center lg:flex-col md:flex md:justify-center md:items-center sm:flex sm:justify-center sm:items-center space-y-4 relative ">
            {cvFileName ? (
              <>
                <div className="flex flex-row pt-3">
                  <h1 className=" font-poppins text-[#101828] text-[18px] leading-[22px] lg:text-[20px] font-medium lg:leading-[28px]">
                    {cvFileName}
                  </h1>
                </div>
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            ) : (
              <>
                <div className="flex flex-row pt-3">
                  <h1 className=" font-poppins text-[#101828] text-[18px] leading-[22px] lg:text-[20px] font-medium lg:leading-[28px]">
                    No files uploaded{' '}
                    <span className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-[#101828]">
                      or drag and drop
                    </span>
                  </h1>
                </div>

                <input
                  id="cv"
                  name="cv"
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </>
            )}

            <BatchingCv
              cvFileName={cvFileName}
              upload={Uploading}
              uploadCheck={UploadCheck}
            />
          </div>
        </div>
        <button
          onClick={handleNavigate}
          className="w-[250px] lg:w-[358px] md:w-[300px] sm:w-[280px] rounded-lg bg-[#3c6fd4] border flex justify-center items-center hover:bg-[#4b82e1] py-3 my-9">
          <p className="text-white font-semibold font-raleway leading-[24px] text-[17px]">
            Upload files
          </p>
        </button>
      </div>
    </div>
  )
}

export default UploadBatch
