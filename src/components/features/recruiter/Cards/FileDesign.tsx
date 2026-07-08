import React, { ReactNode } from 'react'

import styles from './DocumentUploaderCard.module.scss'

type IconType = {
  icon: ReactNode
}

export const FileDesign = ({ icon }: IconType) => {
  return (
    <div className={styles.fileIconOuter}>
      <div className={styles.fileIcon}>{icon}</div>
    </div>
  )
}
