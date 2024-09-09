import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import upload from '../../../assets/Featured icon.png'
import DocumentUploaderCard from '../../../components/Cards/DocumentUploaderCard'

const CVUploadFiles = () => {
  const [cvFileName, setCvFileName] = useState<string | null>(null)
  const [cvFileSize, setCvFileSize] = useState<{
    size: number
    unit: 'MB' | 'KB'
  } | null>(null)

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files && event.currentTarget.files.length > 0) {
      const file = event.currentTarget.files[0] // Get the first file
      setCvFileName(file.name) // Set the file name in state

      // Determine file size in MB or KB
      let fileSizeInMB: number
      let unit: 'MB' | 'KB'
      if (file.size > 1048576) {
        fileSizeInMB = file.size / 1024 / 1024 // Convert from bytes to MB
        unit = 'MB'
      } else {
        fileSizeInMB = file.size / 1024 // Convert from bytes to KB
        unit = 'KB'
      }
      setCvFileSize({ size: Number(fileSizeInMB.toFixed(2)), unit }) // Set size in state

      // Show success message
      toast.success(`File ${file.name} selected successfully`)
    }
  }

  return (
    <div className="mt-4 space-y-6 flex justify-center items-center flex-col">
      {/* <button
        type="button"
        className="w-[600px] p-2 rounded-lg border border-[#D0D5DD] h-[150px] mt-2 bg-white text-[#344054] flex items-center justify-center flex-col">
        <img src={upload} alt="uploadCv" />
        {cvFileName ? (
          <>
            <div className="flex flex-row pt-3">
              <h1 className=" font-poppins text-[#101828] text-[18px] leading-[22px] lg:text-[20px] font-medium lg:leading-[28px]">
                {cvFileName}
              </h1>
            </div>
          </>
        ) : (
          <>
            <span className="text-[#001127] font-raleway font-semibold space-y-2">
              Click to upload{' '}
              <span className="text-gray-500 font-normal">
                or drag and drop
              </span>
              <p className="text-gray-500 font-light">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </span>
            <input
              id="cv"
              name="cv"
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </button> */}

      <DocumentUploaderCard />
    </div>
  )
}

export default CVUploadFiles
