import cn from 'classnames'
import React from 'react'

import { Card } from '@/components/ui/Card'

import styles from './ProgressView.module.scss'

const SKELETON_ROWS = 4

const ProgressSkeleton: React.FC = () => (
  <div className={styles.page}>
    <div className={styles.headerSection}>
      <div className={cn(styles.skeleton, styles.skeletonHeading)} />
      <div className={cn(styles.skeleton, styles.skeletonSubtitle)} />

      <Card className={styles.banner}>
        <div className={styles.bannerMessage}>
          <div className={cn(styles.skeleton, styles.skeletonBannerIcon)} />
          <div className={cn(styles.skeleton, styles.skeletonBannerText)} />
        </div>
        <div className={cn(styles.skeleton, styles.skeletonRing)} />
      </Card>
    </div>

    <div className={styles.itemList}>
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div key={i} className={styles.itemRow}>
          <div className={styles.connectorCol}>
            <div className={cn(styles.dot, styles.skeleton)} />
            {i !== SKELETON_ROWS - 1 && (
              <div className={styles.connectorLine} />
            )}
          </div>

          <Card className={styles.itemCard}>
            <div className={styles.itemInfo}>
              <div className={cn(styles.itemIcon, styles.skeleton)} />
              <div className={cn(styles.skeleton, styles.skeletonTitle)} />
            </div>
            <div className={cn(styles.skeleton, styles.skeletonBadge)} />
          </Card>
        </div>
      ))}
    </div>
  </div>
)

export default ProgressSkeleton
