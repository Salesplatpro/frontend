import React from 'react'

import upload from '@/assets/Featured icon.png'

import styles from './UploadCV.module.scss'

interface UploadCVProps {
  fileName?: string | null
  progress?: number | null
}

const UploadCV: React.FC<UploadCVProps> = ({ fileName, progress }) => {
  return (
    <div className={styles.box}>
      <img src={upload} alt="" className={styles.icon} />
      {fileName ? (
        <span className={styles.fileName}>{fileName}</span>
      ) : (
        <span className={styles.placeholder}>
          Click to upload <span className={styles.hint}>or drag and drop</span>
          <p className={styles.subHint}>PDF, DOCX</p>
        </span>
      )}
      {progress != null && (
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default UploadCV
