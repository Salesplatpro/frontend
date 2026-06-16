import React from 'react'
import { FaFilePdf, FaFileWord, FaRegFile } from 'react-icons/fa'

import styles from './CvFile.module.scss'

interface CvFileProps {
  fileName: string
  url: string
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') return <FaFilePdf size={20} />
  if (ext === 'doc' || ext === 'docx') return <FaFileWord size={20} />
  return <FaRegFile size={20} />
}

const CvFile: React.FC<CvFileProps> = ({ fileName, url }) => {
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
      <label htmlFor="cv" className={styles.replace}>
        Replace
      </label>
    </div>
  )
}

export default CvFile
