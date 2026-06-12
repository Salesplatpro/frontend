import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { DocumentUploaderCard2 } from '@/components/features/recruiter/Cards'
import { FileDesign } from '@/components/features/recruiter/Cards/FileDesign'
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
      if (result[index]?.result?.status === true) {
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
          setMoreFilesToProcess(true)
          break
        }
      } catch (error) {
        console.log('Upload Error:', error)
        setMoreFilesToProcess(true)
        break
      }

      setAllFilesProcessed(
        files.every((_, idx) => result[idx]?.result?.status === true),
      )
    }

    if (allFilesProcessed) {
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
    <>
      <PageHeaderTitle
        paramsId={params}
        description="Upload cv and cover letter in batch for collective AI assessment"
      />
      <div>
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

        {showAddButton && (
          <div className={styles.parentContainer}>
            <div
              className={styles.container}
              onClick={() => cv.current?.click()}
            >
              Upload talent Cv
              {selectedFiles.cv ? (
                <div className={styles.innerContainer}>
                  <IoDocumentTextOutline size={28} color="#3c6fd4" />
                  <div className={styles.description}>
                    <div>
                      <span>{selectedFiles.cv.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.innerContainer}>
                  <FileDesign
                    icon={<AiOutlineCloudUpload size={20} color="#3c6fd4" />}
                  />
                  <div className={styles.description}>
                    <div>
                      <span>Click to upload</span> or drag and drop SVG,PNG, JPG
                      or GIF (max 800px, 400px)
                    </div>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={cv}
                onChange={(e) => handleFileChange(e, 'cv')}
                style={{ display: 'none' }}
              />
            </div>
            <div
              className={styles.container}
              onClick={() => cover.current?.click()}
            >
              Upload talent Cover Letter
              {selectedFiles.coverLetter ? (
                <div className={styles.innerContainer}>
                  <IoDocumentTextOutline size={28} color="#3c6fd4" />
                  <div className={styles.description}>
                    <div>
                      <span>{selectedFiles.coverLetter.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.innerContainer}>
                  <FileDesign
                    icon={<AiOutlineCloudUpload size={20} color="#3c6fd4" />}
                  />
                  <div className={styles.description}>
                    <div>
                      <span>Click to upload</span> or drag and drop SVG,PNG, JPG
                      or GIF (max 800px, 400px)
                    </div>
                  </div>
                </div>
              )}
              <input
                type="file"
                ref={cover}
                onChange={(e) => handleFileChange(e, 'coverLetter')}
                style={{ display: 'none' }}
              />
            </div>
            <div className="w-1/2 mx-auto -py-20">
              <Button
                variant="primary"
                size="wide"
                fullWidth
                onClick={handleAddFileToState}
              >
                {files.length > 0 ? 'Add another profile' : 'Add profile'}
              </Button>
            </div>
          </div>
        )}
        {files.length > 0 && (
          <Button
            variant="primary"
            size="wide"
            fullWidth
            onClick={handleSubmit}
            className={displayButton}
          >
            {buttonTitle}
          </Button>
        )}
      </div>
    </>
  )
}
