import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegFile } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useSelector } from 'react-redux'

import { AnalyzedPercentage } from '../../pages/RecruiterProfile'
import { RootState } from '../../redux/store/store'
import { convertFileSize } from '../../utils'
import { Uploader } from '../Loading'
import styles from './DocumentUploaderCard.module.scss'
import { FileDesign } from './FileDesign'

type DocumentUploaderCardProps = {
  fileSize: number
  fileName: string
  onDelete: () => void
  result?: number
  index: number
  onSeeAnalysis?: () => void
}

export const DocumentUploaderCard = ({
  index,
  fileSize,
  fileName,
  onDelete,
  result,
  onSeeAnalysis,
}: DocumentUploaderCardProps) => {
  const uploads = useSelector((state: RootState) => state.file.uploads)

  if (result) {
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
          <div className="flex flex-col items-end">
            <div>
              <AnalyzedPercentage targetValue={result} />
            </div>
            <div className={styles.textColor} onClick={onSeeAnalysis}>
              See Analysis
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        {result ? (
          <AnalyzedPercentage targetValue={result} />
        ) : (
          <div className="cursor-pointer">
            <RiDeleteBinLine size={20} onClick={onDelete} />
          </div>
        )}
      </div>
      <div className={styles.icon}>
        {uploads[index] ? (
          <IoMdCheckmarkCircle size={24} color="#4985df" />
        ) : (
          <AiOutlineCloudUpload size={24} color="#4985df" />
        )}
        <Uploader size={fileSize} index={index} />
      </div>
    </div>
  )
}
