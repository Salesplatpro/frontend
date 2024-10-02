import React, { ReactNode } from 'react'

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
  item?: ItemType
  tooltip?: boolean
}

export const ChooseMethodCard = ({ onClick, item }: ChooseMethodCardProps) => (
  <div className={styles.container} onClick={onClick}>
    {item?.name}
    <div className={styles.innerContainer}>
      <FileDesign icon={item?.icon} />
      <div className={styles.description}>{item?.description}</div>
    </div>
  </div>
)
