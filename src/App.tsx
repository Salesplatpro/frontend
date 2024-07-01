import './App.css'
import './index.scss'
import './index.css'
import React, { Suspense, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CustomerStories from './components/customerStories'
import Explore from './components/Explore'
// import CreateTalentProfile from './pages/TalentProfile/CreateTalentProfile'
import SingleJob from './components/SingleJob'
import Solutions from './components/Solutions'
import Home from './Home'
import AdminProfileSidebar from './pages/AdminProfile/AdminProfileSidebar'
import TalentLogin from './pages/Auth/Login'
import RecruiterRegister from './pages/Auth/RecruiterRegister'
import TalentRegister from './pages/Auth/TalentRegister'
import GetMatch from './pages/RecruiterProfile/GetMatch/GetMatch'
import GetTalents from './pages/RecruiterProfile/GetTalents/GetTalents'
import IndividualTalents from './pages/RecruiterProfile/IndividualTalents/IndividualTalents'
import JobProfiles from './pages/RecruiterProfile/JobProfiles/JobProfiles'
import PostJobs from './pages/RecruiterProfile/PostJobs/PostJobs'
import RecruiterProfileSidebar from './pages/RecruiterProfile/RecruiterProfileSidebar'
import ViewCandidates from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import ViewTalents from './pages/RecruiterProfile/ViewCandidates/ViewTalents'
import Job from './pages/TalentProfile/Job'
import TalentProfile from './pages/TalentProfile/TalentProfile'
import TalentProfileSidebar from './pages/TalentProfile/TalentProfileSidebar'
import TalentQuiz from './pages/TalentProfile/TalentQuiz/TalentQuiz'
import PostJob from './pages/RecruiterProfile/PostJobs/PostJob'
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
        // element: <PostJobs />,
        element: <PostJob />,
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
    <div className="app" data-testid="app-page">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
