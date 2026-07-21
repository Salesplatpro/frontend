import './App.css'
import './index.scss'
import './index.css'

import React, { Fragment } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SWRConfig } from 'swr'

import { router } from './navigation'

function App() {
  return (
    <Fragment>
      <SWRConfig value={{ shouldRetryOnError: false }}>
        <div className="app" data-testid="app-page">
          <RouterProvider router={router} />
        </div>
      </SWRConfig>
      <Toaster position="top-right" theme="light" closeButton duration={2000} />
    </Fragment>
  )
}

export default App
