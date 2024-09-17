import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import {
  addCvCoverLetter,
  setCvCoverLetter,
} from '../../../../redux/features/filesSlice/fileSlice'
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
    <FileUploader
      showAlert={showAlert}
      alertMessage="Make sure candidate's Cv and Cover letter are saved with same name"
      pageTitle="Cv and cover letter Assessment method"
      pageDescription="Upload cv and cover letter in batch for collective AI assesment"
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
  )
}
