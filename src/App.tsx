import './App.css'
import './index.scss'
import './index.css'

import React, { Fragment, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SWRConfig } from 'swr'

import { router } from './navigation'

const ToasterThemeSync = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = document.documentElement
    const update = () => {
      setTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')
    }
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <Toaster position="top-right" theme={theme} closeButton duration={2000} />
  )
}

function App() {
  return (
    <Fragment>
      <SWRConfig value={{ shouldRetryOnError: false }}>
        <div className="app" data-testid="app-page">
          <RouterProvider router={router} />
        </div>
      </SWRConfig>
      <ToasterThemeSync />
    </Fragment>
  )
}

export default App
