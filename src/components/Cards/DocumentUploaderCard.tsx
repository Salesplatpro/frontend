import React from 'react'
import { FaRegFile } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'

import { Uploader } from '../Loading'
import styles from './DocumentUploaderCard.module.scss'
import { FileDesign } from './FileDesign'

export const DocumentUploaderCard = () => {
  const completed = true
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.file}>
          <FileDesign icon={<FaRegFile size={13} />} />
          <div className={styles.text}>
            <div>Tech design requirements.pdf</div>
            <div>200KB</div>
          </div>
        </div>
        <div>
          <RiDeleteBinLine size={20} />
        </div>
      </div>
      <div className={styles.icon}>
        {completed ? (
          <IoMdCheckmarkCircle size={24} color="#4985df" />
        ) : (
          <div />
        )}
        <Uploader />
      </div>
    </div>
  )
}
