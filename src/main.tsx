import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'

import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
