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
        <img src={uploadCheck} alt="uploadCv" />
      ) : (
        <img src={upload} alt="uploadCv" />
      )}
    </button>
  )
}

export default BatchingCv
