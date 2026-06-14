import './App.css'
import './index.scss'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

import React, { Fragment } from 'react'
import { useMediaQuery } from 'react-responsive'
import { RouterProvider } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
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
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        toastStyle={{
          width: useMediaQuery({ maxWidth: 640 }) ? '80%' : '320px', // Full width on mobile, fixed width on larger screens
          maxWidth: '320px',
          top: useMediaQuery({ maxWidth: 640 }) ? '5rem' : '3rem', // Increased top spacing for mobile
          left: useMediaQuery({ maxWidth: 640 }) ? '50%' : undefined, // Center horizontally on mobile
          transform: useMediaQuery({ maxWidth: 640 })
            ? 'translateX(-50%)'
            : undefined, // Adjust for centering
        }}
      />
    </Fragment>
  )
}

export default App
