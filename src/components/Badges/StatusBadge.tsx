import React from 'react'

type StatusBadgeProps = {
  status: string
  backgroundColor: string
  color: string
}

export const StatusBadge = ({
  status,
  backgroundColor,
  color,
}: StatusBadgeProps) => {
  return (
    <div
      style={{
        background: backgroundColor,
        padding: '4px',
        borderRadius: '8px',
        color: color,
        textAlign: 'center',
      }}>
      {status}
    </div>
  )
}
