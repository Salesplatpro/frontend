import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'

import App from './App'
import { AuthProvider } from './context/contextHook'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
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
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
