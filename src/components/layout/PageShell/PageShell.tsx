import React from 'react'

import styles from './PageShell.module.scss'

type PageShellProps = {
  children: React.ReactNode
  wide?: boolean
  className?: string
}

export const PageShell: React.FC<PageShellProps> = ({
  children,
  wide = false,
  className,
}) => (
  <div
    className={[styles.shell, wide ? styles.wide : '', className]
      .filter(Boolean)
      .join(' ')}>
    {children}
  </div>
)
