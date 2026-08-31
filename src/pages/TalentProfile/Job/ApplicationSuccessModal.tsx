import 'react-responsive-modal/styles.css'

import React from 'react'
import { Modal } from 'react-responsive-modal'

import { Button } from '@/components/ui/Button'

import styles from './ApplicationSuccessModal.module.scss'

type ApplicationSuccessModalProps = {
  open: boolean
  onClose: () => void
}

export const ApplicationSuccessModal = ({
  open,
  onClose,
}: ApplicationSuccessModalProps) => (
  <Modal
    open={open}
    onClose={onClose}
    center
    closeOnEsc
    closeOnOverlayClick
    showCloseIcon={false}
    classNames={{
      overlay: `dashboard-modal-overlay ${styles.overlay}`,
      modal: styles.modal,
    }}
    aria-labelledby="application-success-title">
    <p className={styles.emoji} aria-hidden>
      🎉
    </p>
    <h2 id="application-success-title" className={styles.title}>
      Application submitted
    </h2>
    <p className={styles.body}>
      You are all set. Use the steps above anytime to revisit the questions you
      were asked and the answers you gave.
    </p>
    <div className={styles.actions}>
      <Button type="button" onClick={onClose}>
        Continue
      </Button>
    </div>
  </Modal>
)
