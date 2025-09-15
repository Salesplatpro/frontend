import './App.css'
import './index.scss'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'

import React, { Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'

import CustomerStories from './components/customerStories'
import Explore from './components/Explore'
import Pricing from './components/Pricing'
import ProtectedRoute from './components/ProtectedRoute'
import SingleJob from './components/SingleJob'
import Solutions from './components/Solutions'

import { LandingPage } from './LandingPage'
import PageNotFound from './PageNotFound'
import { MainLayout, Resources } from './pages'
import AdminProfileSidebar from './pages/AdminProfile/AdminProfileSidebar'
import TalentLogin from './pages/Auth/Login'
// import RecruiterRegister from './pages/Auth/RecruiterRegister'
import SignIn from './pages/Auth/SignIn'
import PostedJob from './pages/Home/Jobs/PostedJob'
import VerifyPaymentPage from './pages/Pricing/Verify'
import {
  ApplicationProgress,
  MyJobPosts,
  ProcessCV,
  ProcessCvAndCoverLetter,
  Shortlist,
  UploadCvAndCoverLetter,
  UploadCVOnly,
} from './pages/RecruiterProfile'
import Batching from './pages/RecruiterProfile/Batching/Batching'
import { ChooseMethod } from './pages/RecruiterProfile/Batching/ChooseMethod'
import CreateJD from './pages/RecruiterProfile/Batching/CreateJD'
import SearchResult from './pages/RecruiterProfile/Batching/TalentSearch/SearchResult'
import SearchTalent from './pages/RecruiterProfile/Batching/TalentSearch/SearchTalent'
import AllApplications from './pages/RecruiterProfile/Dashboard/AllApplications'
import Dashboard from './pages/RecruiterProfile/Dashboard/Dashboard'
import { EditJobTab } from './pages/RecruiterProfile/EditJob'
import JobDetail from './pages/RecruiterProfile/JobDetail'
import { SingleJobPost } from './pages/RecruiterProfile/MyJobPosts/SingleJobPost'
import PostJobTab from './pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import { ApplicationPipeline } from './pages/TalentProfile/ApplicationPipeline'
import ProgressView from './pages/TalentProfile/ApplicationPipeline/ProgressView/ProgressView'
import IndividualJob from './pages/TalentProfile/Job/IndividualJob'
import Job from './pages/TalentProfile/Job/Job'
import Notification from './pages/TalentProfile/Notification/NotificationList'
import TalentProfile from './pages/TalentProfile/Profile'
import { Support } from './pages/TalentProfile/Support'
import PersonalityTest from './pages/TalentProfile/TalentAssessment/PersonalityTest'
import PersonalizedTest from './pages/TalentProfile/TalentAssessment/PersonalizedTest'
import TalentAssessment from './pages/TalentProfile/TalentAssessment/TalentAssessment'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import { setUser } from './redux/features/authSlice/authSlice'
import { getToken } from './utils'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <PageNotFound />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
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
        path: 'resources',
        element: <Resources />,
      },
      {
        path: 'customerstories',
        element: <CustomerStories />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'payment/verify',
        element: <VerifyPaymentPage />,
      },
      {
        path: 'login',
        element: <TalentLogin />,
      },

      {
        path: 'register',
        element: <SignIn />,
      },

      {
        path: 'register',
        element: <SignIn />,
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
        path: 'job/postedjob/:jobId',
        element: <PostedJob />,
      },
    ],
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
            path: '/talentDashboard/support',
            element: <Support />,
          },
          {
            path: 'Chat',
            // element: <Chat />,
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
            path: 'editJob/:jobId',
            element: <EditJobTab />,
          },
          {
            path: 'jobdetail/:jobId',
            element: <JobDetail />,
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
  const dispatch = useDispatch()

  useEffect(() => {
    const token = getToken()
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (token && user) {
      dispatch(setUser({ user }))
    }
  }, [dispatch])
  return (
    <Fragment>
      <div className="app" data-testid="app-page">
        <RouterProvider router={router} />
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        toastStyle={{
          width: useMediaQuery({ maxWidth: 640 }) ? '80%' : '320px', // Full width on mobile, fixed width on larger screens
          maxWidth: '320px',
          top: useMediaQuery({ maxWidth: 640 }) ? '5rem' : '3rem', // Increased top spacing for mobile
          left: useMediaQuery({ maxWidth: 640 }) ? '50%' : undefined, // Center horizontally on mobile
          transform: useMediaQuery({ maxWidth: 640 })
            ? 'translateX(-50%)'
            : undefined, // Adjust for centering
        }}
      />
    </Fragment>
  )
}

export default App
