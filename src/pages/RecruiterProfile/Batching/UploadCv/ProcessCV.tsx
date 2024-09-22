import React, { useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { IsProcessing, RecruiterButton } from '../../../../components'
import {
  ChooseMethodCard,
  DocumentUploaderCard,
} from '../../../../components/Cards'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import {
  useGetCampaignNameQuery,
  useUploadCVOnlyMutation,
} from '../../../../redux/api/recruiter'
import {
  addFiles,
  removeFile,
  saveFileResult,
} from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import styles from './ProcessCV.module.scss'

export const details = {
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
  const [handleCvUpload] = useUploadCVOnlyMutation()
  const scoutJobId = params.id ?? ''
  const [moreFilesToProcess, setMoreFilesToProcess] = useState(false)
  const [isReevaluating, setIsReevaluating] = useState(false)
  const [allFilesProcessed, setAllFilesProcessed] = useState(false)
  const { data, isLoading } = useGetCampaignNameQuery(params)

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
    setIsReevaluating(true)

    for (const [index, file] of files.entries()) {
      if (result[index]?.result?.status === true) {
        continue
      }

      const formData = new FormData()
      formData.append('scoutJobId', scoutJobId)
      formData.append('cv', file)

      if (batchId) {
        formData.append('batchId', batchId)
      }

      try {
        const uploadResult = await handleCvUpload(formData).unwrap()
        if (uploadResult.status === true) {
          dispatch(saveFileResult({ index, result: uploadResult }))

          if (index === 0) {
            batchId = uploadResult.data.scout.batchId
          }
        } else {
          setMoreFilesToProcess(true)
          break
        }
      } catch (error) {
        console.log('Upload Error:', error)
        setMoreFilesToProcess(true)
        break
      }

      setAllFilesProcessed(
        files.every((_, index) => result[index]?.result?.status === true),
      )
    }

    if (allFilesProcessed) {
      setMoreFilesToProcess(false)
    }

    setIsReevaluating(false)
  }

  const getResultEvaluationScore = (index: number) =>
    result.length > 0 ? result[index]?.result?.data?.evaluationScore : undefined

  const displayButton =
    result.length === files.length &&
    result.every((res) => res !== undefined && res !== null)
      ? 'hidden'
      : ''

  const buttonTitle = isReevaluating ? (
    <IsProcessing />
  ) : moreFilesToProcess ? (
    'Try evaluating again'
  ) : files.length === 1 ? (
    'Process Document'
  ) : (
    'Process Documents'
  )

  return (
    <div>
      <PageHeaderTitle
        title={isLoading ? '' : `${data?.data?.name} scouting`}
        description="Upload CV in batch for collective AI assessment"
      />
      <div>
        <ChooseMethodCard item={details} onClick={handleFileUpload} />
      </div>
      <div className={styles.uploader}>
        {files.map((file, index) => (
          <DocumentUploaderCard
            key={index}
            index={index}
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
          disabled={files.length === 0 || isReevaluating}
          onClick={handleSubmit}
          className={displayButton}
        />
      </div>
    </div>
  )
}
