import React from 'react'
import { Outlet } from 'react-router-dom'

import { DocumentTitle, NavigationProgress } from '@/components/seo'

import { ScrollToTop } from './ScrollToTop'

export const RootLayout = () => {
  return (
    <>
      <ScrollToTop />
      <NavigationProgress />
      <DocumentTitle />
      <Outlet />
    </>
  )
}
