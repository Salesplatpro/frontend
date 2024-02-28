import './App.css'
import './index.scss'

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Explore from './components/Explore'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" data-testid="app-page">
      <Router>
        <Routes>
          {/* @ts-ignore */}
          <Route exact path='/' element={<Home/>} />
          {/* @ts-ignore */}
          <Route exact path='explore' element={<Explore/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
