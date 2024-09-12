import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { IsProcessing, RecruiterButton } from '../../../../components'
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
  const [moreFilesToProcess, setMoreFilesToProcess] = useState(false)

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

    const checkIfAllFilesHasResult = files.length === result.length
    if (!checkIfAllFilesHasResult) {
      setMoreFilesToProcess(true)
      toast.error('Some files has not been analyzed, Try Again!')
    }
  }

  const getResultEvaluationScore = (index: number) =>
    result.length > 0 ? result[index]?.result?.data?.evaluationScore : undefined

  const displayButton = files.length === result.length ? 'hidden' : ''

  console.log(result)

  const buttonTitle = moreFilesToProcess ? (
    'Try evaluating again'
  ) : isLoading ? (
    <IsProcessing />
  ) : files.length === 1 ? (
    'Process Document'
  ) : (
    'Process Documents'
  )

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
            result={getResultEvaluationScore(index)}
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
          buttonTitle={buttonTitle}
          disabled={files.length === 0}
          onClick={handleSubmit}
          className={displayButton}
        />
      </div>
    </div>
  )
}
