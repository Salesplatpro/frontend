import React, { useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegFile } from 'react-icons/fa'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { FileDesign } from '@/components/features/recruiter/Cards/FileDesign'
import { CheckBox } from '@/components/forms/CheckBox'
import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { Card } from '@/components/ui/Card'
import { setScoutUploads } from '@/redux/features/filesSlice/fileSlice'
import { capitalizeFirstWord, convertFileSize } from '@/utils'

import { Button } from '../../../../components'
import styles from '../../../../components/features/recruiter/Cards/DocumentUploaderCard.module.scss'

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
    <div className="py-4 space-y-4">
      <PageHeaderTitle
        paramsId={params}
        description="Upload CVs in batch for collective AI assessment"
        onBack={() => navigate(-1)}
      />

      <Card className="p-6 space-y-4">
        <div
          className="flex justify-center items-center flex-col py-16 cursor-pointer border border-dashed border-grey-300 rounded-2xl"
          onClick={() => cvInputRef.current?.click()}>
          <FileDesign
            icon={<AiOutlineCloudUpload size={28} color="#3c6fd4" />}
          />
          <p className="mt-3 font-raleway text-grey-900">
            {cvFiles.length > 0
              ? `${cvFiles.length} CV(s) selected`
              : 'Click or drag CVs to upload'}
          </p>
          <p className="text-grey-500 text-sm mt-1">
            PDF or Word, up to {MAX_BATCH_SIZE} files
          </p>
          <input
            ref={cvInputRef}
            type="file"
            multiple
            accept={ALLOWED_DOC_MIMETYPES.join(',')}
            onChange={handleCvChange}
            className="hidden"
          />
        </div>

        {cvFiles.length > 0 && (
          <div className={styles.uploader}>
            {cvFiles.map((file, index) => (
              <div key={index} className={styles.container}>
                <div className={styles.innerContainer}>
                  <div className={styles.file}>
                    <FileDesign icon={<FaRegFile size={20} />} />
                    <div className={styles.text}>
                      <div>{capitalizeFirstWord(file.name)}</div>
                      <div>{convertFileSize(file.size)}</div>
                    </div>
                  </div>
                  <div className="cursor-pointer">
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
              className="flex justify-center items-center flex-col py-10 cursor-pointer border border-dashed border-grey-300 rounded-2xl"
              onClick={() => coverLetterInputRef.current?.click()}>
              <FileDesign
                icon={<AiOutlineCloudUpload size={24} color="#3c6fd4" />}
              />
              <p className="mt-2 font-raleway text-grey-900 text-sm">
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
                className="hidden"
              />
            </div>
            {coverLetterFiles.length > 0 && (
              <div className={styles.uploader}>
                {coverLetterFiles.map((file, index) => (
                  <div key={index} className={styles.container}>
                    <div className={styles.innerContainer}>
                      <div className={styles.file}>
                        <FileDesign icon={<FaRegFile size={20} />} />
                        <div className={styles.text}>
                          <div>{capitalizeFirstWord(file.name)}</div>
                          <div>{convertFileSize(file.size)}</div>
                        </div>
                      </div>
                      <div className="cursor-pointer">
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
              <div className="text-red-600 text-sm">
                You have {cvFiles.length} CV(s) but {coverLetterFiles.length}{' '}
                cover letter(s) — provide one cover letter per CV, in the same
                order.
              </div>
            )}
          </>
        )}

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button
          variant="primary"
          size="wide"
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}>
          Continue
        </Button>
      </Card>
    </div>
  )
}
