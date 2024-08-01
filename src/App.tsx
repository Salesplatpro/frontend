import './App.css'
import './index.scss'
import './index.css'

import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import CustomerStories from './components/customerStories'
import Explore from './components/Explore'
import ProtectedRoute from './components/ProtectedRoute'
// import CreateTalentProfile from './pages/TalentProfile/CreateTalentProfile'
import SingleJob from './components/SingleJob'
import Solutions from './components/Solutions'
import Home from './Home'
import AdminProfileSidebar from './pages/AdminProfile/AdminProfileSidebar'
import TalentLogin from './pages/Auth/Login'
import RecruiterRegister from './pages/Auth/RecruiterRegister'
import SignIn from './pages/Auth/SignIn'
import TalentRegister from './pages/Auth/TalentRegister'
import GetMatch from './pages/RecruiterProfile/GetMatch/GetMatch'
import GetTalents from './pages/RecruiterProfile/GetTalents/GetTalents'
import IndividualTalents from './pages/RecruiterProfile/IndividualTalents/IndividualTalents'
import JobProfiles from './pages/RecruiterProfile/JobProfiles/JobProfiles'
import PostJob from './pages/RecruiterProfile/PostJobs/PostJob'
import PostJobs from './pages/RecruiterProfile/PostJobs/PostJobs'
import PostJobTab from './pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import ViewCandidates from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import ViewTalents from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import { ApplicationPipeline } from './pages/TalentProfile/ApplicationPipeline'
import IndividualJob from './pages/TalentProfile/Job/IndividualJob'
import Job from './pages/TalentProfile/Job/Job'
import TalentAssessment from './pages/TalentProfile/TalentAssessment/TalentAssessment'
import TalentProfile from './pages/TalentProfile/TalentProfile'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import TalentQuiz from './pages/TalentProfile/TalentQuiz/TalentQuiz'
import { setUser } from './redux/features/authSlice/authSlice'
import { getToken } from './utils/authUtils'
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
    element: <SignIn />,
  },
  {
    path: 'login',
    element: <TalentLogin />,
  },

  {
    path: 'SignIn',
    element: <SignIn />,
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
    element: <ProtectedRoute allowedRoles={['talent']} />,
    children: [
      {
        path: '',
        element: <TalentProfileSidebar />,
        children: [
          {
            path: 'talentProfile',
            element: <TalentProfile />,
          },
          {
            path: 'talentQuiz',
            element: <TalentAssessment />,
            // element: <TalentQuiz />,
          },
          {
            path: 'job',
            element: <Job />,
          },
          {
            path: 'job/:jobId',
            element: <IndividualJob />,
          },
          {
            path: 'applicationPipeline',
            element: <ApplicationPipeline />,
          },
        ],
      },
    ],
  },
  {
    path: '/recruiterDashboard',
    element: <ProtectedRoute allowedRoles={['recruiter']} />,
    children: [
      {
        path: '',
        element: <RecruiterProfileSidebar />,
        children: [
          {
            path: 'postjob',
            element: <PostJobTab />,
          },
          {
            path: 'postjob/:aiConfigId',
            element: <PostJobTab />,
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
          {
            path: 'individualTalents/:talentId',
            element: <IndividualTalents />,
          },
        ],
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
  const dispatch = useDispatch()

  useEffect(() => {
    const token = getToken()
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (token && user) {
      dispatch(setUser({ user }))
    }
  }, [dispatch])
  return (
    <div className="app" data-testid="app-page">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
