import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { RecruiterButton } from '../../../../components'
import {
  ChooseMethodCard,
  DocumentUploaderCard2,
} from '../../../../components/Cards'
import { PageHeaderTitle } from '../../../../components/PageHeaderTitle'
import {
  addCvCoverLetter,
  removeCvCoverLetter,
} from '../../../../redux/features/filesSlice/fileSlice'
import { RootState } from '../../../../redux/store/store'
import { sortCvAndCoverLetter } from '../../../../utils/sortCvAndCoverLetter'
import { details } from '../UploadCv'
import styles from '../UploadCv/ProcessCV.module.scss'

export const ProcessCvAndCoverLetter = () => {
  const dispatch = useDispatch()
  const files = useSelector((state: RootState) => state.file.cvCoverLetter)
  const result = useSelector(
    (state: RootState) => state.file.cvCoverLetterResults,
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

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
          buttonTitle="Begin Evaluation"
          disabled={files.length === 0}
        />
      </div>
    </div>
  )
}
