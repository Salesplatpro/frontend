import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import { setFiles } from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import { CvDocumentPicker } from '../CvDocumentPicker'

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
    <>
      <PageHeaderTitle
        title="CV Upload"
        description="Upload CV in batch for collective AI assessment"
      />
      <CvDocumentPicker
        files={files}
        handleFileChange={handleFileChange}
        onUploadClick={() =>
          navigate(`/recruiterDashboard/scout/process-cv/${params.id}`)
        }
        buttonTitle="Upload files"
        disabled={files.length === 0}
      />
    </>
  )
}
