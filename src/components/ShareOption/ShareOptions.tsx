import React from 'react'
import { IoIosLink } from 'react-icons/io'
import { IoMdShare } from 'react-icons/io'

import { notify } from '../../utils/toastNotifications'

type ShareOptionsProps = {
  handleShare: (jobId: string) => void
  jobId: string
}

export const ShareOptions: React.FC<ShareOptionsProps> = ({
  handleShare,
  jobId,
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
      icon: <IoMdShare />,
      text: 'Share',
      action: () => handleShare(jobId),
    },
    {
      icon: <IoIosLink />,
      text: 'Copy',
      action: copyToClipBoard,
    },
  ]

  return (
    <div className="flex space-x-2 items-center justify-center px-2">
      {shareOptions.map((option, i) => (
        <div
          key={i}
          onClick={option.action}
          className={`flex cursor-pointer items-center justify-center text-[17px] ${
            i !== 0 ? 'border-l border-gray-300 px-2' : ''
          }`}>
          {option.icon}
        </div>
      ))}
    </div>
  )
}
