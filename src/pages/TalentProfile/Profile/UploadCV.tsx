import React from 'react'

interface UploadCVProps {
  cvFileName: string | null
  upload: string
}

const UploadCV: React.FC<UploadCVProps> = ({ cvFileName, upload }) => {
  return (
    <button
      type="button"
      className=" w-[100%] p-2 rounded-lg border border-[#D0D5DD] h-[150px] mt-2 bg-white text-[#344054] flex items-center justify-center flex-col">
      <img src={upload} alt="uploadCv" />
      {cvFileName ? (
        <span>{cvFileName}</span>
      ) : (
        <span className="text-[#001127] font-raleway font-semibold space-y-2">
          Click to upload{' '}
          <span className="text-gray-500 font-normal">or drag and drop</span>
          <p className="text-gray-500 font-light">
            SVG, PNG, JPG or GIF (max. 800x400px)
          </p>
        </span>
      )}
    </button>
  )
}

export default UploadCV
