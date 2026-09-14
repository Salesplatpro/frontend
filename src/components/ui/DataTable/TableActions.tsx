import cn from 'classnames'
import React from 'react'

import styles from './DataTable.module.scss'

type TableActionsProps = {
  children: React.ReactNode
  align?: 'end' | 'center'
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export const TableActions = ({
  children,
  align = 'end',
  onClick,
}: TableActionsProps) => (
  <div
    className={cn(styles.actions, align === 'center' && styles.actionsCenter)}
    onClick={onClick}>
    {children}
  </div>
)
