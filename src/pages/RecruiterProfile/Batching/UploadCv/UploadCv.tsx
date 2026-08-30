import React, { useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegFile } from 'react-icons/fa'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { FileDesign } from '@/components/features/recruiter/Cards/FileDesign'
import { CheckBox } from '@/components/forms/CheckBox'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { setScoutUploads } from '@/redux/features/filesSlice/fileSlice'
import { capitalizeFirstWord, convertFileSize } from '@/utils'

import { Button } from '../../../../components'
import fileStyles from '../../../../components/features/recruiter/Cards/DocumentUploaderCard.module.scss'
import styles from './UploadCv.module.scss'

const MAX_BATCH_SIZE = 15
const ALLOWED_DOC_MIMETYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export const UploadCv = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cvInputRef = useRef<HTMLInputElement>(null)
  const coverLetterInputRef = useRef<HTMLInputElement>(null)

  const [cvFiles, setCvFiles] = useState<File[]>([])
  const [coverLetterFiles, setCoverLetterFiles] = useState<File[]>([])
  const [attachCoverLetters, setAttachCoverLetters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFiles = (files: File[]): string | null => {
    if (files.some((f) => !ALLOWED_DOC_MIMETYPES.includes(f.type))) {
      return 'Only PDF or Word documents are allowed'
    }
    return null
  }

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? [])
    setError(null)
    if (selected.length > MAX_BATCH_SIZE) {
      setError(`You can upload at most ${MAX_BATCH_SIZE} CVs at a time`)
      return
    }
    const fileError = validateFiles(selected)
    if (fileError) {
      setError(fileError)
      return
    }
    setCvFiles(selected)
  }

  const handleCoverLetterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(event.target.files ?? [])
    setError(null)
    const fileError = validateFiles(selected)
    if (fileError) {
      setError(fileError)
      return
    }
    setCoverLetterFiles(selected)
  }

  const removeCv = (index: number) => {
    setCvFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeCoverLetter = (index: number) => {
    setCoverLetterFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const coverLetterMismatch =
    attachCoverLetters &&
    coverLetterFiles.length > 0 &&
    coverLetterFiles.length !== cvFiles.length

  const canContinue = cvFiles.length > 0 && !coverLetterMismatch

  const handleContinue = () => {
    if (!canContinue) return
    const entries = cvFiles.map((cv, index) => ({
      cv,
      coverLetter: attachCoverLetters ? coverLetterFiles[index] ?? null : null,
    }))
    dispatch(setScoutUploads(entries))
    navigate(`/recruiterDashboard/scout/process-cv/${params.id}`)
  }

  return (
    <PageShell>
      <PageHeaderTitle
        variant="hero"
        paramsId={params}
        description="Upload CVs in batch for collective AI assessment"
        onBack={() => navigate(-1)}
      />

      <PagePanel>
        <div className={styles.stack}>
          <div
            className={styles.dropzone}
            onClick={() => cvInputRef.current?.click()}>
            <FileDesign
              icon={<AiOutlineCloudUpload size={28} color="#3c6fd4" />}
            />
            <p className={styles.dropzoneTitle}>
              {cvFiles.length > 0
                ? `${cvFiles.length} CV(s) selected`
                : 'Click or drag CVs to upload'}
            </p>
            <p className={styles.dropzoneHint}>
              PDF or Word, up to {MAX_BATCH_SIZE} files
            </p>
            <input
              ref={cvInputRef}
              type="file"
              multiple
              accept={ALLOWED_DOC_MIMETYPES.join(',')}
              onChange={handleCvChange}
              className={styles.hiddenInput}
            />
          </div>

          {cvFiles.length > 0 && (
            <div className={styles.fileList}>
              {cvFiles.map((file, index) => (
                <div key={index} className={fileStyles.container}>
                  <div className={fileStyles.innerContainer}>
                    <div className={fileStyles.file}>
                      <FileDesign icon={<FaRegFile size={20} />} />
                      <div className={fileStyles.text}>
                        <div>{capitalizeFirstWord(file.name)}</div>
                        <div>{convertFileSize(file.size)}</div>
                      </div>
                    </div>
                    <div className={styles.remove}>
                      <RiDeleteBinLine
                        size={20}
                        onClick={() => removeCv(index)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <CheckBox
            name="attachCoverLetters"
            value="attachCoverLetters"
            label="Attach a cover letter for each CV (optional)"
            checked={attachCoverLetters}
            onChange={(event) => {
              const checked = event.target.checked
              setAttachCoverLetters(checked)
              if (!checked) setCoverLetterFiles([])
            }}
          />

          {attachCoverLetters && (
            <>
              <div
                className={`${styles.dropzone} ${styles.dropzoneCompact}`}
                onClick={() => coverLetterInputRef.current?.click()}>
                <FileDesign
                  icon={<AiOutlineCloudUpload size={24} color="#3c6fd4" />}
                />
                <p className={styles.dropzoneTitle}>
                  {coverLetterFiles.length > 0
                    ? `${coverLetterFiles.length} cover letter(s) selected`
                    : 'Select matching cover letters, in the same order as the CVs above'}
                </p>
                <input
                  ref={coverLetterInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_DOC_MIMETYPES.join(',')}
                  onChange={handleCoverLetterChange}
                  className={styles.hiddenInput}
                />
              </div>
              {coverLetterFiles.length > 0 && (
                <div className={styles.fileList}>
                  {coverLetterFiles.map((file, index) => (
                    <div key={index} className={fileStyles.container}>
                      <div className={fileStyles.innerContainer}>
                        <div className={fileStyles.file}>
                          <FileDesign icon={<FaRegFile size={20} />} />
                          <div className={fileStyles.text}>
                            <div>{capitalizeFirstWord(file.name)}</div>
                            <div>{convertFileSize(file.size)}</div>
                          </div>
                        </div>
                        <div className={styles.remove}>
                          <RiDeleteBinLine
                            size={20}
                            onClick={() => removeCoverLetter(index)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {coverLetterMismatch && (
                <div className={styles.error}>
                  You have {cvFiles.length} CV(s) but {coverLetterFiles.length}{' '}
                  cover letter(s) — provide one cover letter per CV, in the same
                  order.
                </div>
              )}
            </>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button
              variant="primary"
              disabled={!canContinue}
              onClick={handleContinue}>
              Continue
            </Button>
          </div>
        </div>
      </PagePanel>
    </PageShell>
  )
}
