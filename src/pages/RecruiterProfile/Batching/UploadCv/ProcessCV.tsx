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
  const [handleCvUpload] = useUploadCVOnlyMutation()
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
    const cv = files[0]
    if (!cv) return

    const formData = new FormData()
    formData.append('scoutJobId', scoutJobId)
    formData.append('cv', cv)

    // Check formData content for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }

    try {
      const result = await handleCvUpload(formData).unwrap()
      console.log(result)
    } catch (error) {
      console.log('Upload Error:', error)
    }
  }

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
            files.length === 1 ? 'Process Document' : 'Process Documents'
          }
          disabled={files.length === 0}
          onClick={handleSubmit}
        />
      </div>
    </div>
  )
}
