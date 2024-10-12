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
import {
  ApplicationProgress,
  MyJobPosts,
  ProcessCV,
  ProcessCvAndCoverLetter,
  Shortlist,
  UploadCVOnly,
} from './pages/RecruiterProfile'
import Batching from './pages/RecruiterProfile/Batching/Batching'
import { ChooseMethod } from './pages/RecruiterProfile/Batching/ChooseMethod'
import CreateJD from './pages/RecruiterProfile/Batching/CreateJD'
import SearchResult from './pages/RecruiterProfile/Batching/TalentSearch/SearchResult'
import SearchTalent from './pages/RecruiterProfile/Batching/TalentSearch/SearchTalent'
import { UploadCvAndCoverLetter } from './pages/RecruiterProfile/Batching/UploadCvAndCoverLetter'
import AllApplications from './pages/RecruiterProfile/Dashboard/AllApplications'
import Dashboard from './pages/RecruiterProfile/Dashboard/Dashboard'
import { SingleJobPost } from './pages/RecruiterProfile/MyJobPosts/SingleJobPost'
import PostJobTab from './pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import { ApplicationPipeline } from './pages/TalentProfile/ApplicationPipeline'
import ProgressView from './pages/TalentProfile/ApplicationPipeline/ProgressView/ProgressView'
import Chat from './pages/TalentProfile/Chat/ChatList'
import IndividualJob from './pages/TalentProfile/Job/IndividualJob'
import Job from './pages/TalentProfile/Job/Job'
import Notification from './pages/TalentProfile/Notification/NotificationList'
import TalentProfile from './pages/TalentProfile/Profile'
import PersonalityTest from './pages/TalentProfile/TalentAssessment/PersonalityTest'
import PersonalizedTest from './pages/TalentProfile/TalentAssessment/PersonalizedTest'
import TalentAssessment from './pages/TalentProfile/TalentAssessment/TalentAssessment'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import { setUser } from './redux/features/authSlice/authSlice'
import { getToken } from './utils'

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
            path: 'Chat',
            element: <Chat />,
          },

          {
            path: 'Notification',
            element: <Notification />,
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
            path: 'dashboard',
            element: <Dashboard />,
          },
          {
            path: 'dashboard/allapplications',
            element: <AllApplications />,
          },
          {
            path: 'postjob',
            element: <PostJobTab />,
          },
          {
            path: 'myJobPosts',
            element: <MyJobPosts />,
          },

          {
            path: 'scout',
            element: <Batching />,
          },
          {
            path: 'scout/:id',
            element: <ChooseMethod />,
          },
          {
            path: 'scout/upload-cv-cover-letter/:id',
            element: <UploadCvAndCoverLetter />,
          },
          {
            path: 'scout/process-cv-cover-letter/:id',
            element: <ProcessCvAndCoverLetter />,
          },
          {
            path: 'scout/search-talent/:id',
            element: <SearchTalent />,
          },
          {
            path: 'scout/search-results/:id',
            element: <SearchResult />,
          },
          {
            path: 'scout/create-jd',
            element: <CreateJD />,
          },
          {
            path: 'scout/upload-cv/:id',
            element: <UploadCVOnly />,
          },
          {
            path: 'scout/process-cv/:id',
            element: <ProcessCV />,
          },
          {
            path: 'singleJobPost/:jobId',
            element: <SingleJobPost />,
          },
          {
            path: 'singleJobPost/:jobId/:applicationId',
            element: <ApplicationProgress />,
          },
          {
            path: 'postjob/:jobId',
            element: <PostJobTab />,
          },
          {
            path: 'shortlist',
            element: <Shortlist />,
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
        // element: <ViewTalents />,
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
