import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { IsProcessing, RecruiterButton } from '../../../../components'
import { DocumentUploaderCard2 } from '../../../../components/Cards'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import { useUploadCvAndCoverLetterMutation } from '../../../../redux/api/recruiter'
import {
  addCvCoverLetter,
  removeCvCoverLetter,
  saveCvCoverLetterResult,
} from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import styles from './UploadCvAndCoverLetter.module.scss'

type CvAndCoverLetterType = {
  cv: File | null
  coverLetter: File | null
}

const defaultValues: CvAndCoverLetterType = {
  cv: null,
  coverLetter: null,
}

export const UploadCvAndCoverLetter = () => {
  const params = useParams()
  const cv = useRef<HTMLInputElement>(null)
  const cover = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [selectedFiles, setSelectedFiles] =
    useState<CvAndCoverLetterType>(defaultValues)
  const [showAddButton, setShowAddButton] = useState<boolean>(true)
  const [isReevaluating, setIsReevaluating] = useState(false)
  const [allFilesProcessed, setAllFilesProcessed] = useState(false)
  const [moreFilesToProcess, setMoreFilesToProcess] = useState(false)
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)
  const result = useSelector(
    (state: RootState) => state.file.cvCoverLetterResults,
  )
  const scoutJobId = params.id ?? ''
  const [handleUploadCvAndCoverLetter] = useUploadCvAndCoverLetterMutation()

  useEffect(() => {
    if (cv.current) cv.current.value = ''
    if (cover.current) cover.current.value = ''
  }, [])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'cv' | 'coverLetter',
  ) => {
    const file = event.target.files?.[0] || null
    setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file }))
  }

  const handleAddFileToState = () => {
    if (selectedFiles.cv && selectedFiles.coverLetter) {
      dispatch(addCvCoverLetter([selectedFiles]))
      setSelectedFiles(defaultValues)
      if (cv.current) cv.current.value = ''
      if (cover.current) cover.current.value = ''
    }
  }

  const handleSubmit = async () => {
    setShowAddButton(false)
    let batchId = ''
    setIsReevaluating(true)
    for (const [index, file] of files.entries()) {
      if (result[index]?.result) {
        continue
      }

      const formData = new FormData()
      formData.append('scoutJobId', scoutJobId)
      if (file.cv) {
        formData.append('cv', file.cv)
      }
      if (file.coverLetter) {
        formData.append('coverLetter', file.coverLetter)
      }
      if (batchId) {
        formData.append('batchId', batchId)
      }

      try {
        const uploadResult = await handleUploadCvAndCoverLetter(
          formData,
        ).unwrap()
        console.log(uploadResult)
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
    <IsProcessing />
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
    <>
      <PageHeaderTitle
        title="Cv and cover letter Assessment method"
        description="Upload cv and cover letter in batch for collective AI assessment"
      />
      <div>
        {showAddButton && (
          <>
            <div>
              <p>Pick CV</p>
              <input
                type="file"
                ref={cv}
                onChange={(e) => handleFileChange(e, 'cv')}
              />
            </div>
            <div>
              <p>Pick a Cover Letter</p>
              <input
                type="file"
                ref={cover}
                onChange={(e) => handleFileChange(e, 'coverLetter')}
              />
            </div>
          </>
        )}
        {showAddButton && (
          <RecruiterButton
            buttonTitle={
              files.length > 0 ? 'Add another profile' : 'Add profile'
            }
            onClick={handleAddFileToState}
          />
        )}

        <div className={styles.uploader}>
          {files.length > 0 &&
            files.map((file, index) => (
              <DocumentUploaderCard2
                index={index}
                key={index}
                cv={file.cv}
                coverLetter={file.coverLetter}
                onDelete={() => dispatch(removeCvCoverLetter(index))}
                result={getResultEvaluationScore(index)}
              />
            ))}
        </div>
        {files.length > 0 && (
          <RecruiterButton
            buttonTitle={buttonTitle}
            onClick={handleSubmit}
            className={displayButton}
          />
        )}
      </div>
    </>
  )
}
