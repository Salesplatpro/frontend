import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../../../redux/store/store'
import { sortCvAndCoverLetter } from '../../../../utils/sortCvAndCoverLetter'
import { FileUploader } from '../FileUploader'

export const UploadCvAndCoverLetter = () => {
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)
  const [showAlert, setShowAlert] = useState(false)
  const [values, setValues] = useState<File[]>([])
  useEffect(() => {
    setShowAlert(true)
  }, [])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles)
      setValues(filesArray)
      console.log(filesArray)
    }
  }

  const handleUpload = () => {
    console.log(values)
    const sortedFiles = sortCvAndCoverLetter(values)
    console.log(sortedFiles)
  }

  return (
    <FileUploader
      showAlert={showAlert}
      alertMessage="Make sure candidate's Cv and Cover letter are saved with same name"
      pageTitle="Cv and cover letter Assessment method"
      pageDescription="Upload cv and cover letter in batch for collective AI assesment"
      buttonTitle="upload files"
      files={files}
      handleFileChange={handleFileChange}
      onUploadClick={handleUpload}
    />
  )
}
