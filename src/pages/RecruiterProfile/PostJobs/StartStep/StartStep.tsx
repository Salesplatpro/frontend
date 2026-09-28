import React, { useId, useState } from 'react'
import { HiOutlineDocumentText, HiOutlineSparkles } from 'react-icons/hi2'
import { MdOutlineEditNote } from 'react-icons/md'

import { Button } from '@/components/ui/Button'
import {
  useGenerateJobContentFromFileMutation,
  useGenerateJobContentMutation,
} from '@/redux/api/recruiter'
import { useGetRoleQuery } from '@/redux/api/talent'
import { getErrorMessage } from '@/utils/getErrorMessage'
import { PostJobFormValues } from '@/utils/jobPostTypes'
import { notify } from '@/utils/toastNotifications'
import { Role } from '@/utils/types'

import {
  GeneratedJobContent,
  generatedJobToForm,
} from '../utils/generatedJobToForm'
import styles from './StartStep.module.scss'

type StartMethod = 'describe' | 'import'

const MIN_DESCRIPTION_LENGTH = 20
const MAX_DESCRIPTION_LENGTH = 4000
const MAX_SOURCE_LENGTH = 30000
const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED_FILES = '.pdf,.docx,.txt'

type StartStepProps = {
  hasDraft?: boolean
  onContinueDraft?: () => void
  onGenerated: (values: PostJobFormValues, filledCount: number) => void
  onStartFromScratch: () => void
}

export const StartStep = ({
  hasDraft = false,
  onContinueDraft,
  onGenerated,
  onStartFromScratch,
}: StartStepProps) => {
  const [method, setMethod] = useState<StartMethod | null>(null)
  const [description, setDescription] = useState('')
  const [sourceText, setSourceText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const describeId = useId()
  const importId = useId()
  const fileId = useId()

  const [generateJobContent, { isLoading: isGeneratingFromText }] =
    useGenerateJobContentMutation()
  const [generateFromFile, { isLoading: isGeneratingFromFile }] =
    useGenerateJobContentFromFileMutation()
  const { data: rolesData } = useGetRoleQuery({})
  const roles: Role[] = Array.isArray(rolesData?.data)
    ? rolesData.data
    : Array.isArray(rolesData?.data?.roles)
    ? rolesData.data.roles
    : []

  const isGenerating = isGeneratingFromText || isGeneratingFromFile
  const descriptionTooShort = description.trim().length < MIN_DESCRIPTION_LENGTH
  const canImport = !!file || sourceText.trim().length >= MIN_DESCRIPTION_LENGTH

  const finish = (content: GeneratedJobContent | undefined) => {
    if (!content) {
      notify('error', 'The AI did not return a job. Please try again.')
      return
    }
    const { values, filledCount } = generatedJobToForm(
      content,
      roles.map((role) => ({ id: String(role.id), name: role.name })),
    )
    onGenerated(values, filledCount)
  }

  const handleDescribe = async () => {
    try {
      const response = await generateJobContent({
        prompt: description.trim(),
      }).unwrap()
      finish(response?.data?.content)
    } catch (err) {
      notify(
        'error',
        getErrorMessage(err, 'Could not write the job. Please try again.'),
      )
    }
  }

  const handleImport = async () => {
    try {
      let response
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        response = await generateFromFile(formData).unwrap()
      } else {
        response = await generateJobContent({
          sourceText: sourceText.trim(),
        }).unwrap()
      }
      finish(response?.data?.content)
    } catch (err) {
      notify(
        'error',
        getErrorMessage(err, 'Could not read that job description.'),
      )
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0] ?? null
    event.target.value = ''
    if (picked && picked.size > MAX_FILE_BYTES) {
      notify('error', 'That file is over 5 MB. Please upload a smaller one.')
      return
    }
    setFile(picked)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>How would you like to start?</h2>
      <p className={styles.subheading}>
        Let AI write the first draft, or fill in the form yourself. You can edit
        everything before it goes live.
      </p>

      {hasDraft && onContinueDraft && (
        <div className={styles.draftBanner}>
          <span>You have an unfinished job draft.</span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onContinueDraft}
            disabled={isGenerating}>
            Continue your draft
          </Button>
        </div>
      )}

      <div className={styles.cards}>
        <button
          type="button"
          className={[
            styles.card,
            method === 'describe' ? styles.cardActive : '',
          ].join(' ')}
          aria-pressed={method === 'describe'}
          onClick={() => setMethod('describe')}
          disabled={isGenerating}>
          <span className={styles.cardIcon} aria-hidden>
            <HiOutlineSparkles />
          </span>
          <span className={styles.cardTitle}>Describe it</span>
          <span className={styles.cardText}>
            Write a few sentences about the job and AI fills in the rest.
          </span>
        </button>

        <button
          type="button"
          className={[
            styles.card,
            method === 'import' ? styles.cardActive : '',
          ].join(' ')}
          aria-pressed={method === 'import'}
          onClick={() => setMethod('import')}
          disabled={isGenerating}>
          <span className={styles.cardIcon} aria-hidden>
            <HiOutlineDocumentText />
          </span>
          <span className={styles.cardTitle}>Import a job description</span>
          <span className={styles.cardText}>
            Paste one you already have, or upload a PDF, Word or text file.
          </span>
        </button>

        <button
          type="button"
          className={styles.card}
          onClick={onStartFromScratch}
          disabled={isGenerating}>
          <span className={styles.cardIcon} aria-hidden>
            <MdOutlineEditNote />
          </span>
          <span className={styles.cardTitle}>Start from scratch</span>
          <span className={styles.cardText}>
            {hasDraft
              ? 'Clear your draft and fill in an empty form yourself.'
              : 'Fill in the form yourself, with AI help on each field if you want it.'}
          </span>
        </button>
      </div>

      {method === 'describe' && (
        <section className={styles.panel}>
          <label htmlFor={describeId} className={styles.label}>
            Describe the job
          </label>
          <textarea
            id={describeId}
            className={styles.textarea}
            value={description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Senior backend engineer for our fintech team in Lagos, hybrid, 4–6 years with Node.js and PostgreSQL, ₦800k–₦1.2m a month."
            disabled={isGenerating}
          />
          <p className={styles.tip}>
            Tip: mention the role, experience, location or remote, and pay. AI
            only fills in what you tell it — it won&apos;t guess the salary or
            location.
          </p>
          <div className={styles.panelActions}>
            <Button
              type="button"
              variant="primary"
              loading={isGeneratingFromText}
              disabled={descriptionTooShort}
              onClick={handleDescribe}>
              Write my job post
            </Button>
          </div>
        </section>
      )}

      {method === 'import' && (
        <section className={styles.panel}>
          <label htmlFor={importId} className={styles.label}>
            Paste your job description
          </label>
          <textarea
            id={importId}
            className={styles.textarea}
            value={sourceText}
            maxLength={MAX_SOURCE_LENGTH}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder="Paste the full job description here"
            disabled={isGenerating || !!file}
          />

          <div className={styles.fileRow}>
            <span className={styles.or}>or</span>
            <input
              id={fileId}
              type="file"
              accept={ACCEPTED_FILES}
              className={styles.fileInput}
              onChange={handleFileChange}
              disabled={isGenerating}
            />
            <label htmlFor={fileId} className={styles.fileButton}>
              Upload a file
            </label>
            {file && (
              <span className={styles.fileName}>
                {file.name}
                <button
                  type="button"
                  className={styles.removeFile}
                  onClick={() => setFile(null)}
                  aria-label={`Remove ${file.name}`}
                  disabled={isGenerating}>
                  Remove
                </button>
              </span>
            )}
          </div>
          <p className={styles.tip}>
            Tip: PDF, DOCX or TXT up to 5 MB. We read the text to fill in the
            form and don&apos;t store the file.
          </p>
          <div className={styles.panelActions}>
            <Button
              type="button"
              variant="primary"
              loading={isGeneratingFromText || isGeneratingFromFile}
              disabled={!canImport}
              onClick={handleImport}>
              Fill in the form
            </Button>
          </div>
        </section>
      )}

      {isGenerating && (
        <p className={styles.progress} role="status">
          Writing your job post… this usually takes 10–20 seconds.
        </p>
      )}
    </div>
  )
}
