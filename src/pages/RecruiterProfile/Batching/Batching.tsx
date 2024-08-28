import React, { useState } from 'react'

import UploadCheck from '../../../assets/Upload Check.png'
import Uploading from '../../../assets/Uploading.png'
import BatchingCv from './BatchingCv'

const Batching = () => {
  const [cvFileName, setCvFileName] = useState<string | null>(null)
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

      <div className="lg:w-[1100px] h-[550px] flex justify-center items-center flex-col bg-[#F8F8F8] border border-[#D0D5DD] rounded-2xl">
        <div className="lg:flex lg:justify-center lg:items-center lg:flex-col space-y-4 relative w-[100%]">
          {cvFileName ? (
            <>
              <div className="space-y-2 text-center">
                <h1 className=" font-raleway text-[#101828] text-[25px] font-bold leading-[28px]">
                  CV Uploaded
                </h1>
                <p className="font-raleway font-normal text-[20px] leading-[28px] text-[#101828]">
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
                <h1 className=" font-raleway text-[#101828] text-[25px] font-bold leading-[28px]">
                  Upload applicants CV in batch
                </h1>
                <p className="font-raleway font-normal text-[20px] leading-[28px] text-[#101828]">
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
                    // setFieldValue('cv', file)
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

      <div className="flex justify-between items-center lg:w-[1100px]">
        <button>Cancel</button>
        <button>Save</button>
      </div>
    </div>
  )
}

export default Batching
