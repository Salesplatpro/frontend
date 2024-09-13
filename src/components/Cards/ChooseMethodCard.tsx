import React, { ReactNode } from 'react'

import { CustomToolTip } from '../../pages/RecruiterProfile'
import styles from './ChooseMethodCard.module.scss'
import { FileDesign } from './FileDesign'

type ItemType = {
  id?: number
  name?: string
  description: ReactNode
  icon: ReactNode
}

type ChooseMethodCardProps = {
  onClick?: () => void
  item: ItemType
  tooltip: boolean
}

const toolTipMessage =
  "Before uploading, please Make sure to save candidate's Cv and Cover letter with same file name"

export const ChooseMethodCard = ({
  onClick,
  item,
  tooltip,
}: ChooseMethodCardProps) => (
  <div className={styles.container} onClick={onClick}>
    {tooltip ? (
      <CustomToolTip message={toolTipMessage}>
        {item.name}
        <div className={styles.innerContainer}>
          <FileDesign icon={item.icon} />
          <div className={styles.description}>{item.description}</div>
        </div>
      </CustomToolTip>
    ) : (
      <>
        {item.name}
        <div className={styles.innerContainer}>
          <FileDesign icon={item.icon} />
          <div className={styles.description}>{item.description}</div>
        </div>
      </>
    )}
  </div>
)
