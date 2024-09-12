import React, { useRef } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { RecruiterButton } from '../../../../components'
import {
  ChooseMethodCard,
  DocumentUploaderCard,
} from '../../../../components/Cards'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import { useUploadCVOnlyMutation } from '../../../../redux/api/recruiter'
import {
  addFiles,
  removeFile,
  saveFileResult,
} from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import styles from './ProcessCV.module.scss'

const details = {
  description: (
    <div>
      <span>Click to upload</span> or drag and drop SVG, PNG, JPG, or GIF (max
      800px, 400px)
    </div>
  ),
  icon: <AiOutlineCloudUpload size={20} />,
}

export const ProcessCV = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const files = useSelector((state: RootState) => state.file.files)
  const result = useSelector((state: RootState) => state.file.results)
  const [handleCvUpload, { isLoading }] = useUploadCVOnlyMutation()
  const scoutJobId = params.id ?? ''

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      dispatch(addFiles(Array.from(selectedFiles)))
    }
  }

  const handleSubmit = async () => {
    let batchId = ''

    for (const [index, file] of files.entries()) {
      const formData = new FormData()
      formData.append('scoutJobId', scoutJobId)
      formData.append('cv', file)

      if (batchId) {
        formData.append('batchId', batchId)
      }

      try {
        const result = await handleCvUpload(formData).unwrap()
        if (result.status === true) {
          console.log(`File ${index + 1} uploaded:`, result)
          dispatch(saveFileResult({ index, result }))

          if (index === 0) {
            batchId = result.data.scout.batchId
          }
        } else {
          console.log('Error uploading CV')
        }
      } catch (error) {
        console.log('Upload Error:', error)
      }
    }
  }

  console.log(result)

  return (
    <div>
      <PageHeaderTitle
        title="CV Upload"
        description="Upload CV in batch for collective AI assessment"
      />
      <div>
        <ChooseMethodCard item={details} onClick={handleFileUpload} />
      </div>
      <div className={styles.uploader}>
        {files.map((file, index) => (
          <DocumentUploaderCard
            key={index}
            fileName={file.name}
            fileSize={file.size}
            onDelete={() => dispatch(removeFile(index))}
          />
        ))}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
      <div>
        <RecruiterButton
          buttonTitle={
            isLoading
              ? 'Submitting...'
              : files.length === 1
              ? 'Process Document'
              : 'Process Documents'
          }
          disabled={files.length === 0}
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}
