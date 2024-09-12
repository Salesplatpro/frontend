import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegFile } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'

import { convertFileSize } from '../../utils'
import { Uploader } from '../Loading'
import styles from './DocumentUploaderCard.module.scss'
import { FileDesign } from './FileDesign'

type DocumentUploaderCardProps = {
  fileSize: number
  fileName: string
  onDelete: () => void
}

const DEFAULT_PROGRESS_GRANULARITY = 1
const DEFAULT_UPDATE_PER_SECS = 2

export const DocumentUploaderCard = ({
  fileSize,
  fileName,
  onDelete,
}: DocumentUploaderCardProps) => {
  const [completed, setCompleted] = useState(false)

  const increment = (fileSize * DEFAULT_PROGRESS_GRANULARITY) / 100
  const interval = fileSize / DEFAULT_UPDATE_PER_SECS

  useEffect(() => {
    const timer = setTimeout(() => {
      setCompleted(true)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.file}>
          <FileDesign icon={<FaRegFile size={20} />} />
          <div className={styles.text}>
            <div>{fileName}</div>
            <div>{convertFileSize(fileSize)}</div>
          </div>
        </div>
        <div className="cursor-pointer">
          <RiDeleteBinLine size={20} onClick={onDelete} />
        </div>
      </div>
      <div className={styles.icon}>
        {completed ? (
          <IoMdCheckmarkCircle size={24} color="#4985df" />
        ) : (
          <AiOutlineCloudUpload size={24} color="#4985df" />
        )}
        <Uploader increment={increment} interval={interval} />
      </div>
    </div>
  )
}
