import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux/store/store'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
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
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
