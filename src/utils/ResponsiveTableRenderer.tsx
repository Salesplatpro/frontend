import React, { ReactNode } from 'react'

interface ResponsiveTableProps {
  screenWidth: number
  breakpoint: number
  children: ReactNode
}

export const ResponsiveTableRenderer = ({
  screenWidth,
  breakpoint,
  children,
}: ResponsiveTableProps) => {
  return screenWidth > breakpoint ? <>{children}</> : null
}
