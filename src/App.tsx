import './App.css'
import './index.scss'
import './index.css'

// eslint-disable-next-line no-unused-vars
import React, { Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import CustomerStories from './components/customerStories'
import Explore from './components/Explore'
import ProtectedRoute from './components/ProtectedRoute'
import SingleJob from './components/SingleJob'
import Solutions from './components/Solutions'
import Home from './Home'
import AdminProfileSidebar from './pages/AdminProfile/AdminProfileSidebar'
import TalentLogin from './pages/Auth/Login'
import RecruiterRegister from './pages/Auth/RecruiterRegister'
import SignIn from './pages/Auth/SignIn'
import { MyJobPosts } from './pages/RecruiterProfile'
import GetMatch from './pages/RecruiterProfile/GetMatch/GetMatch'
import GetTalents from './pages/RecruiterProfile/GetTalents/GetTalents'
import IndividualTalents from './pages/RecruiterProfile/IndividualTalents/IndividualTalents'
import JobProfiles from './pages/RecruiterProfile/JobProfiles/JobProfiles'
import { SingleJobPost } from './pages/RecruiterProfile/MyJobPosts/SingleJobPost'
import PostJobTab from './pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import ViewTalents from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import { ApplicationPipeline } from './pages/TalentProfile/ApplicationPipeline'
import JobPipeline from './pages/TalentProfile/ApplicationPipeline/JobPipeline'
import ProgressView from './pages/TalentProfile/ApplicationPipeline/ProgressView/ProgressView'
import IndividualJob from './pages/TalentProfile/Job/IndividualJob'
import Job from './pages/TalentProfile/Job/Job'
import PersonalityTest from './pages/TalentProfile/TalentAssessment/PersonalityTest'
import PersonalizedTest from './pages/TalentProfile/TalentAssessment/PersonalizedTest'
import TalentAssessment from './pages/TalentProfile/TalentAssessment/TalentAssessment'
import TalentProfile from './pages/TalentProfile/TalentProfile'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import { setUser } from './redux/features/authSlice/authSlice'
import { getToken } from './utils/authUtils'

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
    path: 'login',
    element: <TalentLogin />,
  },

  {
    path: 'talentRegister',
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
          {
            path: 'applicationPipeline/personalizedTest/:jobId/:talentId',
            element: <PersonalizedTest />,
          },
          {
            path: 'applicationPipeline/:jobId',
            element: <ProgressView />,
            // element: <JobPipeline />,
          },
          {
            path: 'applicationPipeline/personalityTest/:jobId',
            element: <PersonalityTest />,
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
            path: 'myJobPosts',
            element: <MyJobPosts />,
          },
          {
            path: 'singleJobPost/:jobId',
            element: <SingleJobPost />,
          },
          {
            path: 'postjob/:jobId',
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
