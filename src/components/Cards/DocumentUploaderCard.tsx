import React, { useEffect, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaRegFile } from 'react-icons/fa'
import { IoMdCheckmarkCircle } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useLocation } from 'react-router-dom'

import { Uploader } from '../Loading'
import styles from './DocumentUploaderCard.module.scss'
import { FileDesign } from './FileDesign'

const DocumentUploaderCard = () => {
  const [completed, setCompleted] = useState(false)

  // Simulate upload completion (you can replace this with actual logic)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCompleted(true) // Mark the upload as completed after a delay (e.g., 3 seconds)
    }, 8000)

    return () => clearTimeout(timer) // Cleanup timer on component unmount
  }, [])

  const location = useLocation()
  const { fileName, fileSize, fileUnit } = location.state || {}
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.file}>
          <FileDesign icon={<FaRegFile size={20} />} />
          <div className={styles.text}>
            <div>{fileName}</div>
            <div>
              {fileSize} {fileUnit}
            </div>
          </div>
        </div>
        <div className="cursor-pointer">
          <RiDeleteBinLine size={20} />
        </div>
      </div>
      <div className={styles.icon}>
        {completed ? (
          <IoMdCheckmarkCircle size={24} color="#4985df" />
        ) : (
          <AiOutlineCloudUpload size={24} color="#4985df" />
        )}
        <Uploader />
      </div>
    </div>
  )
}
export default DocumentUploaderCard
