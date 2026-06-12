import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'

import uploadCheck from '../../../../assets/cvuploadonly.png'
import { Button } from '../../../../components'
import { setFiles } from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'

export const UploadCVOnly = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.file.files)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles)
      dispatch(setFiles(filesArray))
    }
  }

  return (
    <div>
      <PageHeaderTitle
        paramsId={params}
        description="Upload CV in batch for collective AI assessment"
      />

      <div
        className="flex justify-center items-center flex-col pt-24 cursor-pointer"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <div className="flex justify-center items-center w-full max-w-4xl bg-grey-50 border border-grey-300 rounded-2xl">
          <div className="flex justify-center items-center w-full flex-col space-y-4 pb-12 pt-1 px-6 relative">
            <div className="flex flex-row pt-3">
              <h1 className="font-poppins text-grey-900 text-[18px] leading-[22px] lg:text-[20px] font-medium lg:leading-[28px]">
                {files.length > 0
                  ? files.map((file) => file.name).join(', ')
                  : 'No files selected'}{' '}
                <span className="font-raleway font-normal text-[17px] leading-[20px] lg:text-[20px] lg:leading-[28px] sm:text-[20px] md:text-[22px] md:leading-[25px] text-grey-900">
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
      <Button
        variant="primary"
        size="wide"
        fullWidth
        onClick={() =>
          navigate(`/recruiterDashboard/scout/process-cv/${params.id}`)
        }
        disabled={files.length === 0}
      >
        Upload files
      </Button>
    </div>
  )
}
