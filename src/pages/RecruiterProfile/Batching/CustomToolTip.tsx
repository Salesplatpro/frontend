import Tooltip from '@mui/material/Tooltip'
import * as React from 'react'
import { ReactNode } from 'react'

interface CustomToolTipProps {
  children?: ReactNode | any
  message: string
}

export const CustomToolTip = ({ children, message }: CustomToolTipProps) => {
  return (
    <Tooltip title={message} placement="top" style={{ fontWeight: 'normal' }}>
      {children}
    </Tooltip>
  )
}
