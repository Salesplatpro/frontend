import './App.css'
import './index.scss'

import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import Explore from './components/Explore'
import Solutions from './components/Solutions'
import CustomerStories from './components/customerStories'
import ApplyForJob from './components/ApplyForJobs/TalentProfile'
import HireTalents from './components/HireTalents/HireTalents'
import TalentRegister from './components/ApplyForJobs/TalentRegister'
import TalentLogin from './components/ApplyForJobs/TalentLogin'
import TalentProfile from './components/ApplyForJobs/TalentProfile'
import SingleJob from './components/SingleJob'
import RecruiterRegister from './components/HireTalents/RecruiterRegister'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: 'explore',
    element: <Explore />,
  },
  {
    path: 'solution',
    element: <Solutions />,
  },
  {
    path: 'customerstories',
    element: <CustomerStories />,
  },
  {
    path: 'apply',
    element: <TalentProfile />,
  },
  {
    path: 'hire',
    element: <HireTalents />,
  },
  {
    path: 'talentRegister',
    element: <TalentRegister />,
  },
  {
    path: 'talentLogin',
    element: <TalentLogin />,
  },
  {
    path: 'recruiterRegister',
    element: <RecruiterRegister />
  },
  {
    path: 'customerstories',
    element: <CustomerStories />,
  },
  {
    path: 'job',
    element: <SingleJob />,
  },
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App" data-testid="app-page">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
