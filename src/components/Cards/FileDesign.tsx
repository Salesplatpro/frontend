import React from 'react'

import styles from './DocumentUploaderCard.module.scss'

type IconType = {
  icon: React.ReactElement
}

export const FileDesign = ({ icon }: IconType) => {
  return (
    <div className={styles.fileIconOuter}>
      <div className={styles.fileIcon}>{icon}</div>
    </div>
  )
}
