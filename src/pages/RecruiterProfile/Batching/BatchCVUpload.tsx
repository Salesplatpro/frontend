import React, { useState } from 'react'
import toast from 'react-hot-toast'

import UploadCheck from '../../../assets/Upload Check.png'
import Uploading from '../../../assets/Uploading.png'
import { useCvAndCoverLetterMutation } from '../../../redux/api/recruiter/index' // Import the hook
import BatchingCv from './BatchingCv'

const BatchCVUpload = () => {
  const [cvFileName, setCvFileName] = useState<string | null>(null)

  const [cvAndCoverLetter, { isLoading }] = useCvAndCoverLetterMutation() // Use the hook

  const handleSave = async () => {
    if (cvFileName) {
      try {
        const fileInput = document.getElementById('cv') as HTMLInputElement
        if (fileInput && fileInput.files) {
          const file = fileInput.files[0]

          const formData = new FormData()
          formData.append('cv', file) // Append the actual file, not just the file name

          await cvAndCoverLetter(formData).unwrap() // Call the mutation and unwrap the result

          console.log(formData)
          console.log('CV and cover letter uploaded successfully')

          toast.success('CV and cover letter uploaded successfully')
        }
      } catch (error) {
        console.error('Error uploading CV and cover letter:', error)
        toast.error('Error uploading CV and cover letter')
      }
    }
  }
  return (
    <div className="py-4 space-y-4 ">
      <div className="space-y-2">
        <h1 className=" font-raleway text-[#101828] text-[32px] font-bold leading-[37.57px]">
          Upload CV
        </h1>
        <p className="font-raleway font-normal text-[20px] leading-[23.48px] text-[#101828]">
          Upload cv in batch for collective AI assesment
        </p>
      </div>

      <div className="flex justify-center items-center lg:w-[1100px] md:w-[850px] sm:w-[670px] h-[550px] lg:flex lg:justify-center lg:items-center md:flex md:justify-center md:items-center sm::flex sm:justify-center sm:items-center flex-col bg-[#F8F8F8] border border-[#D0D5DD] rounded-2xl">
        <div className="flex justify-center items-center w-[100%] flex-col lg:flex lg:justify-center lg:items-center lg:flex-col md:flex md:justify-center md:items-center sm:flex sm:justify-center sm:items-center space-y-4 relative ">
          {cvFileName ? (
            <>
              <div className="space-y-2 text-center ">
                <h1 className=" font-raleway text-[#101828] text-[20px] leading-[22px] lg:text-[25px]  font-bold lg:leading-[28px]">
                  CV Uploaded
                </h1>
                <p className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-[#101828]">
                  The CV is already uploaded
                </p>
              </div>
              <input
                id="cv"
                name="cv"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0]
                    // setFieldValue('cv', file)
                    setCvFileName(file.name) // Update file name state
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <h1 className="font-raleway text-[#101828] text-[18px] leading-[20px] lg:text-[25px] font-bold lg:leading-[28px]">
                  Upload applicants CV in batch
                </h1>
                <p className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-[#101828]">
                  when uploaded, the CV’s will be checked collectively by an AI
                </p>
              </div>

              <input
                id="cv"
                name="cv"
                type="file"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    const file = event.currentTarget.files[0]
                    setCvFileName(file.name) // Update file name state
                  }
                }}
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

      <div className="flex justify-between items-center lg:w-[1100px] md:w-[850px] sm:w-[670px]">
        {cvFileName ? (
          <>
            <button
              className="border-2 border-[#3C6FD4] px-[22px] py-[14px] rounded-xl cursor-pointer text-[#3C6FD4] font-raleway leading-[30px] text-[18.3px] font-medium hover:bg-[#3C6FD4] hover:text-white"
              onClick={() => setCvFileName(null)}>
              Cancel
            </button>
            <button
              className="border-2 border-[#3C6FD4] px-[24px] py-[15.3px] rounded-xl cursor-pointer bg-[#3C6FD4] text-white shadow-custom font-raleway leading-[30px] text-[18.3px] font-medium hover:bg-[#3765c0] hover:text-white"
              onClick={handleSave}
              disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default BatchCVUpload
