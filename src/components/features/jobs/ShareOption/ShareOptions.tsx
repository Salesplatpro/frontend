import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import copy from '@/assets/copy.svg'
import share from '@/assets/share.svg'
import { notify } from '@/utils/toastNotifications'

import styles from './ShareOptions.module.scss'

type ShareOptionsProps = {
  handleShare: (jobId: string) => void
  jobId: string
  tooltipContent?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipVariant?: 'dark' | 'light' | 'success' | 'error' | 'info' | 'warning'
}

export const ShareOptions: React.FC<ShareOptionsProps> = ({
  handleShare,
  jobId,
  tooltipContent,
  tooltipPosition = 'bottom',
  tooltipVariant = 'info',
}) => {
  const copyToClipBoard = () => {
    const jobLink = `https://auxhr.com/job/postedjob/${jobId}`
    navigator.clipboard
      .writeText(jobLink)
      .then(() => {
        notify('success', 'Copied to clipboard!')
      })
      .catch(() => {
        notify('error', 'Failed to copy to clipboard.')
      })
  }

  const shareOptions = [
    {
      icon: share,
      text: 'Share',
      action: () => handleShare(jobId),
    },
    {
      icon: copy,
      text: 'Copy',
      action: copyToClipBoard,
    },
  ]

  return (
    <div className={styles.row}>
      {shareOptions.map((option) => (
        <button
          key={option.text}
          type="button"
          data-tooltip-id="share-tooltip"
          data-tooltip-content={option.text}
          onClick={option.action}
          className={styles.action}
          aria-label={option.text}>
          <img src={option.icon} alt="" className={styles.icon} />
        </button>
      ))}

      <ReactTooltip
        id="share-tooltip"
        place={tooltipPosition}
        variant={tooltipVariant}
        content={tooltipContent}
      />
    </div>
  )
}
