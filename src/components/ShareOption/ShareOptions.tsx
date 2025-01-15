import React from 'react'
import { IoIosLink } from 'react-icons/io'
import { LuShare } from 'react-icons/lu'

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
      icon: <LuShare />,
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
    <div className="flex space-x-2 items-center justify-center">
      {shareOptions.map((option, i) => (
        <div
          key={i}
          onClick={option.action}
          className="flex cursor-pointer items-center justify-center space-x-2 border border-[#E7E7E9] w-[72px] h-[34px] rounded-lg hover:bg-[#5c8beb]">
          {option.icon}
          <span className="font-medium">{option.text}</span>
        </div>
      ))}
    </div>
  )
}
