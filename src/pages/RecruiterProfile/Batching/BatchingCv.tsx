import React from 'react'

interface BatchingCvProps {
  cvFileName: string | null
  upload: string
  uploadCheck: string
}

const BatchingCv: React.FC<BatchingCvProps> = ({
  cvFileName,
  upload,
  uploadCheck,
}) => {
  return (
    <button type="button">
      {/* <img src={upload} alt="uploadCv" /> */}
      {cvFileName ? (
        <img
          src={uploadCheck}
          alt="uploadCv"
          className="w-[102px] lg:w-[110px]"
        />
      ) : (
        <img src={upload} alt="uploadCv" className="w-[102px] lg:w-[110px]" />
      )}
    </button>
  )
}

export default BatchingCv
