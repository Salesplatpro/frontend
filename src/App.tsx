import './App.css'
import './index.scss'

import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home'
import Explore from './components/Explore'
import Solutions from './components/Solutions'
import CustomerStories from './components/customerStories'
import TalentRegister from './pages/Auth/TalentRegister'
import TalentLogin from './pages/Auth/Login'
// import CreateTalentProfile from './pages/TalentProfile/CreateTalentProfile'
import SingleJob from './components/SingleJob'
import RecruiterRegister from './pages/Auth/RecruiterRegister'
import TalentQuiz from './pages/TalentProfile/TalentQuiz/TalentQuiz'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import TalentProfile from './pages/TalentProfile/TalentProfile'
import Job from './pages/TalentProfile/Job'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import PostJobs from './pages/RecruiterProfile/PostJobs/PostJobs'
import ViewCandidates from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import ViewTalents from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import AdminProfileSidebar from './pages/AdminProfile/AdminProfileSidebar'
import GetTalents from './pages/RecruiterProfile/GetTalents/GetTalents'
import GetMatch from './pages/RecruiterProfile/GetMatch/GetMatch'
import JobProfiles from './pages/RecruiterProfile/JobProfiles/JobProfiles'
// const TalentProfileSidebar = React.lazy(
//   () => import('./pages/TalentProfile/TalentProfileSidebar'),
// )
// const TalentProfile = React.lazy(
//   () => import('./pages/TalentProfile/TalentProfile'),
// )
// const TalentQuiz = React.lazy(
//   () => import('./pages/TalentProfile/TalentQuiz/TalentQuiz'),
// )
// const Job = React.lazy(() => import('./pages/TalentProfile/Job'))

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
    path: 'talentRegister',
    element: <TalentRegister />,
  },
  {
    path: 'login',
    element: <TalentLogin />,
  },
  {
    path: 'recruiterRegister',
    element: <RecruiterRegister />,
  },
  {
    path: 'customerstories',
    element: <CustomerStories />,
  },
  {
    path: 'job',
    element: <SingleJob />,
  },
  {
    path: '/talentDashboard',
    element: <TalentProfileSidebar />,
    children: [
      {
        path: 'talentProfile',
        element: <TalentProfile />,
      },
      {
        path: 'talentQuiz',
        element: <TalentQuiz />,
      },
      {
        path: 'job',
        element: <Job />,
      },
    ],
  },
  {
    path: '/recruiterDashboard',
    element: <RecruiterProfileSidebar />,
    children: [
      {
        path: 'postjob',
        element: <PostJobs />,
      },
      {
        path: 'viewcandidates',
        element: <ViewTalents />,
      },
      {
        path: 'getTalents',
        element: <GetTalents />,
      },
      {
        path: 'jobProfiles',
        element: <JobProfiles />,
      },
      {
        path: 'getMatch/:jobId',
        element: <GetMatch />,
      },
    ],
  },
  {
    path: '/adminDashboard',
    element: <AdminProfileSidebar />,
    children: [
      {
        path: 'viewcandidates',
        element: <ViewTalents />,
      },
    ],
  },
])

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="App" data-testid="app-page">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
