import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import {
  ChooseMethodCard,
  DocumentUploaderCard2,
} from '@/components/features/recruiter/Cards'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Spinner } from '@/components/ui/Spinner'

import { Button } from '../../../../components'
import { useUploadCvAndCoverLetterMutation } from '../../../../redux/api/recruiter'
import {
  addCvCoverLetter,
  removeCvCoverLetter,
  saveCvCoverLetterResult,
} from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import { sortCvAndCoverLetter } from '../../../../utils/sortCvAndCoverLetter'
import { details } from '../UploadCv'
import styles from '../UploadCv/ProcessCV.module.scss'

export const ProcessCvAndCoverLetter = () => {
  const params = useParams()

  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)
  const result = useSelector(
    (state: RootState) => state.file.cvCoverLetterResults,
  )
  const scoutJobId = params.id ?? ''
  const [isReevaluating, setIsReevaluating] = useState(false)
  const [handleUploadCvAndCoverLetter] = useUploadCvAndCoverLetterMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [allFilesProcessed, setAllFilesProcessed] = useState(false)
  const [moreFilesToProcess, setMoreFilesToProcess] = useState(false)

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const sortedFiles = sortCvAndCoverLetter(Array.from(selectedFiles))
      dispatch(addCvCoverLetter(sortedFiles))
    }
  }

  const handleSubmit = async () => {
    let batchId = ''
    setIsReevaluating(true)
    for (const [index, file] of files.entries()) {
      if (result[index]?.result) {
        continue
      }

      const formData = new FormData()
      formData.append('scoutJobId', scoutJobId)
      // @ts-expect-error TODO: fix type error
      formData.append('cv', file.cv)
      // @ts-expect-error TODO: fix type error
      formData.append('coverLetter', file.coverLetter)

      if (batchId) {
        formData.append('batchId', batchId)
      }
      try {
        const uploadResult = await handleUploadCvAndCoverLetter(
          formData,
        ).unwrap()
        if (uploadResult.status === true) {
          dispatch(saveCvCoverLetterResult({ index, result: uploadResult }))
          if (index === 0) {
            batchId = uploadResult.data.scout.batchId
          }
        } else {
          console.log('Error uploading CV and Cover Letter')
        }
      } catch (error) {
        console.log('Upload Error:', error)
      }

      setAllFilesProcessed(
        files.every((_, index) => result[index]?.result?.status === true),
      )
    }

    if (!allFilesProcessed) {
      setMoreFilesToProcess(true)
    } else {
      setMoreFilesToProcess(false)
    }

    setIsReevaluating(false)
  }

  const displayButton =
    result.length === files.length &&
    result.every((res) => res !== undefined && res !== null)
      ? 'hidden'
      : ''

  const buttonTitle = isReevaluating ? (
    <Spinner size="sm" />
  ) : moreFilesToProcess ? (
    'Try evaluating again'
  ) : files.length === 1 ? (
    'Process Document'
  ) : (
    'Process Documents'
  )

  const getResultEvaluationScore = (index: number) =>
    result.length > 0 ? result[index]?.result?.data?.evaluationScore : undefined

  return (
    <div>
      <PageHeaderTitle
        title="Cv and cover letter Assessment method"
        description="Upload cv and cover letter in batch for collective AI assesment"
      />
      <div>
        <ChooseMethodCard item={details} onClick={handleFileUpload} />
      </div>
      <div className={styles.uploader}>
        {files.map((file, index) => (
          <DocumentUploaderCard2
            key={index}
            index={index}
            cv={file.cv}
            coverLetter={file.coverLetter}
            onDelete={() => dispatch(removeCvCoverLetter(index))}
            result={getResultEvaluationScore(index)}
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
        <Button
          variant="primary"
          size="wide"
          fullWidth
          disabled={files.length === 0 || isReevaluating}
          onClick={handleSubmit}
          className={displayButton}>
          {buttonTitle}
        </Button>
      </div>
    </div>
  )
}
