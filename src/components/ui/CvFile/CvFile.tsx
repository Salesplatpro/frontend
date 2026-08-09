import React from 'react'
import { FaFilePdf, FaFileWord, FaRegFile } from 'react-icons/fa'

import styles from './CvFile.module.scss'

interface CvFileProps {
  fileName: string
  /** When set, the file name is a link that opens this URL (legacy / direct URL). */
  url?: string
  /** When set (and url is omitted), clicking the file name runs this handler (authenticated PDF). */
  onOpen?: () => void
  /** id of a sibling file `<input>` — when given, renders a "Replace" label (talent's own profile). */
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
  onOpen,
  replaceInputId,
}) => {
  return (
    <div className={styles.box}>
      <div className={styles.icon}>{getFileIcon(fileName)}</div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.fileName}
          title={fileName}>
          {fileName}
        </a>
      ) : onOpen ? (
        <button
          type="button"
          className={styles.fileNameButton}
          title={fileName}
          onClick={onOpen}>
          {fileName}
        </button>
      ) : (
        <span className={styles.fileNameStatic} title={fileName}>
          {fileName}
        </span>
      )}
      {replaceInputId && (
        <label htmlFor={replaceInputId} className={styles.replace}>
          Replace
        </label>
      )}
    </div>
  )
}
