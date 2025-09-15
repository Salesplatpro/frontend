import React, { useEffect, useState } from 'react'

import Facebook from '../../../assets/Facebook icon.svg'
import LinkedIn from '../../../assets/linkedin logo_icon.svg'
import Twitter from '../../../assets/twitter_new_brand_icon.svg'

type ModalProps = {
  onClose: () => void
  shareLinks: {
    facebook: string

    twitter: string

    linkedin: string
  }
}

const ShareJobModal: React.FC<ModalProps> = ({ onClose, shareLinks }) => {
  const [isVisible, setIsVisible] = useState(true)

  const shareOptions = [
    {
      icon: Facebook,
      text: 'Share',
      action: 'share',
      link: shareLinks.facebook,
    },

    {
      icon: Twitter,
      text: 'Tweet',
      action: 'share',
      link: shareLinks.twitter,
    },
    {
      icon: LinkedIn,
      text: 'Share',
      action: 'share',
      link: shareLinks.linkedin,
    },
  ]

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.classList.contains('overlay')) {
      handleClose()
    }
  }

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 100)
  }

  const handleShare = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
    handleClose()
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = ''
    }
  }, [])

  return (
    <div
      className="modal w-full h-full fixed top-7 lg:left-16 md:left-0 right-0 bottom-0"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true">
      <div
        className="overlay w-full h-full fixed top-0 md:left-0 right-0 bottom-0 bg-[rgba(49,49,49,0.8)]"
        onClick={handleOverlayClick}
        role="presentation"
        aria-hidden="true"></div>

      <div
        className={`modal-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col rounded-lg bg-gray-100 p-5 lg:p-14 md:p-12 sm:p-13 max-w-[600px] min-w-[300px] ${
          isVisible ? 'scale-up-center' : ''
        }`}
        role="document">
        <h2
          id="modal-title"
          className="text-[18px] lg:text-[20px] md:text-[25px] text-center sm:text-[20px] font-medium font-raleway">
          Select you preferred social media to share job
        </h2>
        <p className="text-center px-10 py-3">{}</p>

        {shareOptions.map((option, index) => {
          return (
            <div key={index}>
              <button
                className="px-14 lg:px-24 md:px-24 border-[1px] py-4 my-5 rounded-lg font-normal font-raleway text-center text-[14px] lg:text-[20px] md:text-[18px] bg-white border-[#E7E7E9] hover:bg-[#e8eaee] flex flex-row justify-center items-center"
                onClick={() => handleShare(option.link)}
                aria-label="Confirm action">
                <img
                  src={option.icon}
                  alt={option.text}
                  className="pr-4 w-[38px] h-[38px] object-contain "
                />
                {option.text}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ShareJobModal
