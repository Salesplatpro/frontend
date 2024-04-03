import './App.css'
import './index.scss'

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import Explore from './components/Explore'
import Solutions from './components/Solutions'
import CustomerStories from './components/customerStories'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: 'explore',
    element: <Explore/>,
  },
  {
    path: "solution",
    element: <Solutions/>,
  },
  {
    path: "customerstories",
    element: <CustomerStories/>,
  }
]);

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" data-testid="app-page">
      <RouterProvider router={router} />
      {/* <Router>
        <Routes>
          @ts-ignore
          <Route exact path='/' element={<Home/>} />
          @ts-ignore
          <Route exact path='explore' element={<Explore/>} />
        </Routes>
      </Router> */}
    </div>
  )
}

export default App
