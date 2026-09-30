import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { FiShare2 } from 'react-icons/fi'
import { Modal } from 'react-responsive-modal'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import copyIcon from '@/assets/copy.svg'
import facebookIcon from '@/assets/Facebook icon.svg'
import linkedinIcon from '@/assets/linkedin logo_icon.svg'
import shareIcon from '@/assets/share.svg'
import xIcon from '@/assets/twitter_new_brand_icon.svg'
import { buildJobShareUrl, buildShareTargets } from '@/utils/shareLinks'
import { notify } from '@/utils/toastNotifications'

import styles from './ShareJob.module.scss'

type ShareJobProps = {
  jobId: string
  /**
   * Used to pre-fill the X post, the WhatsApp message and the native share
   * sheet. Falls back to a generic label when the caller has not loaded it.
   */
  jobTitle?: string
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right'
  tooltipVariant?: 'dark' | 'light' | 'success' | 'error' | 'info' | 'warning'
}

type ShareEntry = {
  key: string
  label: string
  icon: React.ReactNode
  onSelect: () => void
}

const canNativeShare = (): boolean =>
  typeof navigator !== 'undefined' && typeof navigator.share === 'function'

export const ShareJob: React.FC<ShareJobProps> = ({
  jobId,
  jobTitle,
  tooltipPosition = 'bottom',
  tooltipVariant = 'info',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const shareUrl = buildJobShareUrl(jobId)
  const shareTitle = jobTitle ? `${jobTitle} — job opening` : 'Job opening'

  const openExternal = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        notify('success', 'Copied to clipboard!')
      })
      .catch(() => {
        notify('error', 'Failed to copy to clipboard.')
      })
  }

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: shareTitle,
        text: shareTitle,
        url: shareUrl,
      })
      setIsModalOpen(false)
    } catch (error) {
      // AbortError just means the viewer dismissed the sheet.
      if ((error as Error)?.name !== 'AbortError') {
        notify('error', 'Could not open the share sheet.')
      }
    }
  }

  const targets = buildShareTargets(shareUrl, shareTitle)

  const networkEntries: ShareEntry[] = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: <img src={facebookIcon} alt="" className={styles.optionIcon} />,
      onSelect: () => openExternal(targets.facebook),
    },
    {
      key: 'x',
      label: 'X',
      icon: <img src={xIcon} alt="" className={styles.optionIcon} />,
      onSelect: () => openExternal(targets.x),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: <img src={linkedinIcon} alt="" className={styles.optionIcon} />,
      onSelect: () => openExternal(targets.linkedin),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp className={styles.optionIcon} aria-hidden />,
      onSelect: () => openExternal(targets.whatsapp),
    },
    {
      key: 'copy',
      label: 'Copy link',
      icon: <img src={copyIcon} alt="" className={styles.optionIcon} />,
      onSelect: copyToClipboard,
    },
  ]

  // The OS sheet is the best mobile path so it leads, but the explicit
  // networks stay visible because navigator.share is absent on most desktops.
  const entries: ShareEntry[] = canNativeShare()
    ? [
        {
          key: 'native',
          label: 'Share via…',
          icon: <FiShare2 className={styles.optionIcon} aria-hidden />,
          onSelect: handleNativeShare,
        },
        ...networkEntries,
      ]
    : networkEntries

  return (
    <>
      <div className={styles.row}>
        <button
          type="button"
          data-tooltip-id="share-tooltip"
          data-tooltip-content="Share"
          onClick={() => setIsModalOpen(true)}
          className={styles.action}
          aria-label="Share">
          <img src={shareIcon} alt="" className={styles.actionIcon} />
        </button>
        <button
          type="button"
          data-tooltip-id="share-tooltip"
          data-tooltip-content="Copy"
          onClick={copyToClipboard}
          className={styles.action}
          aria-label="Copy">
          <img src={copyIcon} alt="" className={styles.actionIcon} />
        </button>

        <ReactTooltip
          id="share-tooltip"
          place={tooltipPosition}
          variant={tooltipVariant}
        />
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{ overlay: 'dashboard-modal-overlay' }}>
        <div className={styles.modal}>
          <h2 className={styles.title}>
            Select your preferred social media to share job
          </h2>
          <div className={styles.options}>
            {entries.map((entry) => (
              <button
                key={entry.key}
                type="button"
                className={styles.option}
                onClick={entry.onSelect}>
                {entry.icon}
                {entry.label}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
