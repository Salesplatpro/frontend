import React from 'react'

import uploadCheck from '../../../assets/cvuploadonly.png'
import { RecruiterButton } from '../../../components'
import { CvCoverLetter } from '../../../redux/features/filesSlice/fileSlice'

interface FileUploaderProps {
  files?: File[] | CvCoverLetter[]
  handleFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onUploadClick?: () => void
  buttonTitle: string
  disabled?: boolean
}

export const CvDocumentPicker = ({
  files,
  handleFileChange,
  onUploadClick,
  buttonTitle,
  disabled,
}: FileUploaderProps) => {
  const renderFileNames = () => {
    if (!files || files.length === 0) {
      return 'No files selected'
    }

    return files
      .map((file) => {
        if (file instanceof File) {
          return file.name
        } else if ('cv' in file && 'coverLetter' in file) {
          return `${file.cv.name}, ${file.coverLetter.name}`
        }
        return ''
      })
      .join(', ')
  }

  return (
    <>
      <div className="flex justify-center items-center flex-col pt-24 cursor-pointer">
        <div className="flex justify-center items-center w-full max-w-4xl bg-[#F8F8F8] border border-[#D0D5DD] rounded-2xl">
          <div className="flex justify-center items-center w-full flex-col space-y-4 pb-12 pt-1 px-6 relative">
            <div className="flex flex-row pt-3">
              <h1 className="font-poppins text-[#101828] text-[18px] leading-[22px] lg:text-[20px] font-medium lg:leading-[28px]">
                {renderFileNames()}
                <span className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-[#101828]">
                  {' '}
                  click or drag and drop
                </span>
              </h1>
            </div>
            <img
              src={uploadCheck}
              alt="uploadCv"
              className="w-[102px] lg:w-[110px] align-middle"
            />
          </div>
        </div>
        <input
          type="file"
          id="fileInput"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <RecruiterButton
        buttonTitle={buttonTitle}
        onClick={onUploadClick}
        disabled={disabled}
      />
    </>
  )
}
