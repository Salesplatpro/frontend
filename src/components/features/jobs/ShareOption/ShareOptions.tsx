import React from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import copy from '@/assets/copy.svg'
import share from '@/assets/share.svg'
import { notify } from '@/utils/toastNotifications'

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
      icon: <img src={share} alt="share icon" className="size-6" />,
      text: 'Share',
      action: () => handleShare(jobId),
    },
    {
      icon: <img src={copy} alt="copy icon" className="size-5" />,
      text: 'Copy',
      action: copyToClipBoard,
    },
  ]

  return (
    <div className="flex space-x-2 items-center justify-center px-2">
      {shareOptions.map((option, i) => (
        <div
          key={i}
          data-tooltip-id="share-tooltip"
          data-tooltip-content={option.text}
          onClick={option.action}
          className={`flex cursor-pointer items-center justify-center text-[17px] size-8 ${
            i !== 0 ? 'border-l border-gray-300 px-2' : ''
          }`}>
          {option.icon}
        </div>
      ))}

      {/* Tooltip only once */}
      <ReactTooltip
        id="share-tooltip"
        place={tooltipPosition}
        variant={tooltipVariant}
        content={tooltipContent}
      />
    </div>
  )
}
