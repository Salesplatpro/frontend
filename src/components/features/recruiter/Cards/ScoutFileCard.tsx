import React from 'react'
import { FaRegFile } from 'react-icons/fa'
import { IoAlertCircleOutline } from 'react-icons/io5'
import { RiDeleteBinLine } from 'react-icons/ri'

import { AnalyzedPercentage } from '@/pages/RecruiterProfile'
import { ScoutReport } from '@/redux/features/filesSlice/fileSlice'
import { capitalizeFirstWord, convertFileSize } from '@/utils'

import styles from './DocumentUploaderCard.module.scss'
import { FileDesign } from './FileDesign'

type ScoutFileCardProps = {
  cv: File
  coverLetter: File | null
  onDelete?: () => void
  result?: ScoutReport
  failureReason?: string
  onRetry?: () => void
  retrying?: boolean
}

const FileRow = ({ file }: { file: File }) => (
  <div className={styles.file}>
    <FileDesign icon={<FaRegFile size={20} />} />
    <div className={styles.text}>
      <div>{capitalizeFirstWord(file.name)}</div>
      <div>{convertFileSize(file.size)}</div>
    </div>
  </div>
)

export const ScoutFileCard = ({
  cv,
  coverLetter,
  onDelete,
  result,
  failureReason,
  onRetry,
  retrying,
}: ScoutFileCardProps) => {
  if (result) {
    return (
      <div className={styles.container}>
        <div className={styles.innerContainer}>
          <div className="flex flex-col">
            <FileRow file={cv} />
            {coverLetter && <FileRow file={coverLetter} />}
          </div>
          <div className="flex flex-col items-end">
            <AnalyzedPercentage targetValue={result.evaluationScore ?? 0} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className="flex flex-col">
          <FileRow file={cv} />
          {coverLetter && <FileRow file={coverLetter} />}
        </div>
        <div className="cursor-pointer">
          <RiDeleteBinLine size={20} onClick={onDelete} />
        </div>
      </div>
      {failureReason && (
        <div className="flex items-center justify-between gap-2 px-4 pb-3 text-red-600 text-sm">
          <span className="flex items-center gap-1.5">
            <IoAlertCircleOutline size={16} />
            <span>{failureReason}</span>
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="underline shrink-0 disabled:opacity-60">
              {retrying ? 'Retrying…' : 'Retry'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
