import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux/store/store'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container is missing in index.html')
}

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
