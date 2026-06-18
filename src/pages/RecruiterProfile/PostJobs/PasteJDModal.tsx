import 'react-responsive-modal/styles.css'

import React, { useState } from 'react'
import { Modal } from 'react-responsive-modal'

import { Button } from '@/components/ui/Button'

import { ParsedJD, parseJobDescription } from './parseJobDescription'
import styles from './PasteJDModal.module.scss'

interface PasteJDModalProps {
  open: boolean
  onClose: () => void
  onApply: (parsed: ParsedJD) => void
}

const PasteJDModal: React.FC<PasteJDModalProps> = ({
  open,
  onClose,
  onApply,
}) => {
  const [text, setText] = useState('')

  const handleApply = () => {
    if (!text.trim()) return
    const parsed = parseJobDescription(text)
    onApply(parsed)
    setText('')
    onClose()
  }

  const handleClose = () => {
    setText('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      center
      classNames={{ overlay: 'dashboard-modal-overlay' }}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Paste Job Description</h2>
        <p className={styles.subtext}>
          Paste your existing job description below. We&apos;ll extract the
          details and pre-fill the form for you.
        </p>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Paste your job description here...\n\nExample:\nRole: Senior Product Manager\nJob Brief: We are looking for...\nRequirements: 5+ years experience...\nSkills: Roadmapping, Agile, Jira\nWork Mode: Hybrid\nExperience Level: Senior\nMin Salary: 500000\nMax Salary: 800000\nCurrency: NGN`}
        />
        <div className={styles.actions}>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleApply}
            disabled={!text.trim()}>
            Parse &amp; Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default PasteJDModal
