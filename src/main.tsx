import './styles/tokens.css'

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'

import App from './App'
import { store } from './redux/store/store'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root container is missing in index.html')
}

hydrateRoot(
  container,
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
)
