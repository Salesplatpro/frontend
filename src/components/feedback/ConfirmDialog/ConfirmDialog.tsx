import 'react-responsive-modal/styles.css'

import React from 'react'
import { Modal } from 'react-responsive-modal'

import { Button } from '@/components/ui/Button'

import { Alert } from '../Alert'
import styles from './ConfirmDialog.module.scss'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
  isConfirming?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Modal
    open={open}
    onClose={onCancel}
    center
    classNames={{ overlay: 'dashboard-modal-overlay' }}>
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <Alert variant={variant === 'danger' ? 'warning' : 'info'}>
        {message}
      </Alert>
      <div className={styles.actions}>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isConfirming}>
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={variant === 'danger' ? 'secondary' : 'primary'}
          className={variant === 'danger' ? styles.dangerButton : undefined}
          onClick={onConfirm}
          loading={isConfirming}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
)
