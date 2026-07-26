import React from 'react'
import { FaFilePdf, FaFileWord, FaRegFile } from 'react-icons/fa'

import styles from './CvFile.module.scss'

interface CvFileProps {
  fileName: string
  url: string
  /** id of a sibling file `<input>` — when given, renders a "Replace" label wired to it (talent's own profile). Omit for a read-only view (e.g. the recruiter's applicant view). */
  replaceInputId?: string
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') return <FaFilePdf size={20} />
  if (ext === 'doc' || ext === 'docx') return <FaFileWord size={20} />
  return <FaRegFile size={20} />
}

export const CvFile: React.FC<CvFileProps> = ({
  fileName,
  url,
  replaceInputId,
}) => {
  return (
    <div className={styles.box}>
      <div className={styles.icon}>{getFileIcon(fileName)}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fileName}
        title={fileName}>
        {fileName}
      </a>
      {replaceInputId && (
        <label htmlFor={replaceInputId} className={styles.replace}>
          Replace
        </label>
      )}
    </div>
  )
}
