import React, { useEffect, useState } from 'react'

import { FileUploader } from '../FileUploader'

export const UploadCvAndCoverLetter = () => {
  const [showAlert, setShowAlert] = useState(false)
  useEffect(() => {
    setShowAlert(true)
  }, [])
  return (
    <FileUploader
      showAlert={showAlert}
      alertMessage="Make sure candidate's Cv and Cover letter are saved with same name"
      pageTitle="Cv and cover letter Assessment method"
      pageDescription="Upload cv and cover letter in batch for collective AI assesment"
      buttonTitle="upload files"
    />
  )
}
