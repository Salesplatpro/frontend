import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RecruiterButton } from '../../../../components'
import { DocumentUploaderCard2 } from '../../../../components/Cards'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import { addCvCoverLetter } from '../../../../redux/features/filesSlice/fileSlice'
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
  const cv = useRef<HTMLInputElement>(null)
  const cover = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const [selectedFiles, setSelectedFiles] =
    useState<CvAndCoverLetterType>(defaultValues)
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)

  useEffect(() => {
    if (cv.current) cv.current.value = ''
    if (cover.current) cover.current.value = ''
  }, [])

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'cv' | 'coverLetter',
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFiles((prevFiles) => ({ ...prevFiles, [type]: file }))
    }
  }

  const handleAddFileToState = () => {
    if (selectedFiles.cv && selectedFiles.coverLetter) {
      if (files.length > 1) {
        dispatch(addCvCoverLetter([selectedFiles]))
        setSelectedFiles(defaultValues)
        if (cv.current) cv.current.value = ''
        if (cover.current) cover.current.value = ''
      }
      dispatch(addCvCoverLetter([selectedFiles]))
      setSelectedFiles(defaultValues)
      if (cv.current) cv.current.value = ''
      if (cover.current) cover.current.value = ''
    }
  }

  return (
    <>
      <PageHeaderTitle
        title="Cv and cover letter Assessment method"
        description="Upload cv and cover letter in batch for collective AI assessment"
      />
      <div>
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
        <RecruiterButton
          buttonTitle={files.length > 0 ? 'Add another profile' : 'Add profile'}
          onClick={handleAddFileToState}
        />

        <div className={styles.uploader}>
          {files.length > 0 &&
            files.map((file, index) => (
              <DocumentUploaderCard2
                index={index}
                key={index}
                cv={file.cv}
                coverLetter={file.coverLetter}
              />
            ))}
        </div>
        {files.length > 0 && (
          <RecruiterButton buttonTitle="Process Documents" />
        )}
      </div>
    </>
  )
}
