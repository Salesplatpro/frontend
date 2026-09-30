import React, { useEffect } from 'react'
import { IoClose } from 'react-icons/io5'

import styles from './Drawer.module.scss'

export type DrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: React.ReactNode
  /** Rendered in the header, beside the close button. */
  actions?: React.ReactNode
  children: React.ReactNode
}

/**
 * One slide-over for the whole app, replacing the two bespoke implementations that
 * had drifted apart. Sits at `--z-drawer` rather than inventing its own z-index.
 */
export const Drawer = ({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
}: DrawerProps) => {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className={styles.overlay}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close panel"
      />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}>
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.headerActions}>
            {actions}
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Close">
              <IoClose aria-hidden />
            </button>
          </div>
        </header>
        <div className={styles.body}>{children}</div>
      </aside>
    </div>
  )
}
