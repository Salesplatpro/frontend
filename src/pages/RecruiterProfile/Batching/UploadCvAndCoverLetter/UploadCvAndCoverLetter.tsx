import { Alert } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import { setCvCoverLetter } from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import { sortCvAndCoverLetter } from '../../../../utils/sortCvAndCoverLetter'
import { FileUploader } from '../FileUploader'

export const UploadCvAndCoverLetter = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)
  const [showAlert, setShowAlert] = useState(false)
  useEffect(() => {
    setShowAlert(true)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles)
      const sortedFiles = sortCvAndCoverLetter(filesArray)
      console.log(sortedFiles)
      dispatch(setCvCoverLetter(sortedFiles))
    }
  }

  return (
    <>
      <PageHeaderTitle
        title="Cv and cover letter Assessment method"
        description="Upload cv and cover letter in batch for collective AI assesment"
      />
      <div className="mt-4">
        {showAlert && (
          <Alert severity="info">
            Make sure candidate&lsquo;s Cv and Cover letter are saved with same
            name
          </Alert>
        )}
      </div>
      <FileUploader
        buttonTitle="upload files"
        files={files}
        disabled={files.length === 0}
        handleFileChange={handleFileChange}
        onUploadClick={() =>
          navigate(
            `/recruiterDashboard/scout/process-cv-cover-letter/${params.id}`,
          )
        }
      />
    </>
  )
}
