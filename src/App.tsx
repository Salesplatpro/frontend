import './App.css'
import './index.scss'

import React, { useState } from 'react'
import Home from './Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" data-testid="app-page">
      <Home/>
    </div>
  )
}

export default App
