import React from 'react'
import { RouteObject } from 'react-router-dom'

import SingleJob from '@/components/features/jobs/SingleJob'
import CustomerStories from '@/components/features/landing/customerStories'
import Explore from '@/components/features/landing/Explore'
import {
  AboutUs,
  Features,
  PrivacyPolicy,
  TermsAndCondition,
  Testimonials,
} from '@/components/features/landing/landingPageComponents'
import Faq from '@/components/features/landing/landingPageComponents/FAQ/Faq'
import Pricing from '@/components/features/landing/Pricing'
import Solutions from '@/components/features/landing/Solutions'
import ProtectedRoute from '@/components/routing/ProtectedRoute'
import { LoginPage, SignupPage } from '@/features/auth/pages'
import PreAssessmentPage from '@/features/pre-assessment/page'
import { LandingPage } from '@/LandingPage'
import PageNotFound from '@/PageNotFound'
import { MainLayout, Resources } from '@/pages'
import AdminProfileSidebar from '@/pages/AdminProfile/AdminProfileSidebar'
import AdminRoles from '@/pages/AdminProfile/Roles/Roles'
import ViewCandidates from '@/pages/AdminProfile/ViewCandidates/ViewCandidates'
import PostedJob from '@/pages/Home/Jobs/PostedJob'
import VerifyPaymentPage from '@/pages/Pricing/Verify'
import {
  ApplicationProgress,
  Chat,
  MyJobPosts,
  Notification as RecruiterNotification,
  ProcessCV,
  ProcessCvAndCoverLetter,
  Profile as RecruiterProfilePage,
  Shortlist,
  UploadCvAndCoverLetter,
  UploadCVOnly,
} from '@/pages/RecruiterProfile'
import Batching from '@/pages/RecruiterProfile/Batching/Batching'
import { ChooseMethod } from '@/pages/RecruiterProfile/Batching/ChooseMethod'
import CreateJD from '@/pages/RecruiterProfile/Batching/CreateJD'
import SearchResult from '@/pages/RecruiterProfile/Batching/TalentSearch/SearchResult'
import SearchTalent from '@/pages/RecruiterProfile/Batching/TalentSearch/SearchTalent'
import AllApplications from '@/pages/RecruiterProfile/Dashboard/AllApplications'
import Dashboard from '@/pages/RecruiterProfile/Dashboard/Dashboard'
import { EditJobTab } from '@/pages/RecruiterProfile/EditJob'
import JobDetail from '@/pages/RecruiterProfile/JobDetail'
import { SingleJobPost } from '@/pages/RecruiterProfile/MyJobPosts/SingleJobPost'
import PostJobTab from '@/pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from '@/pages/RecruiterProfile/RecruiterProfileSidebar'
import { ApplicationPipeline } from '@/pages/TalentProfile/ApplicationPipeline'
import ProgressView from '@/pages/TalentProfile/ApplicationPipeline/ProgressView/ProgressView'
import TalentDashboardHome from '@/pages/TalentProfile/Dashboard/TalentDashboardHome'
import Inbox from '@/pages/TalentProfile/Inbox/InboxList'
import IndividualJob from '@/pages/TalentProfile/Job/IndividualJob'
import Job from '@/pages/TalentProfile/Job/Job'
import Notifications from '@/pages/TalentProfile/Notifications/NotificationsList'
import TalentProfile from '@/pages/TalentProfile/Profile'
import { Support } from '@/pages/TalentProfile/Support'
import PersonalityTest from '@/pages/TalentProfile/TalentAssessment/PersonalityTest'
import PersonalizedTest from '@/pages/TalentProfile/TalentAssessment/PersonalizedTest'
import TalentProfileSidebar from '@/pages/TalentProfile/TalentProfileSidebar'
import { paths } from '@/paths'

export const routeConfig: RouteObject[] = [
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
        path: 'features',
        element: <Features />,
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
        path: 'about-us',
        element: <AboutUs />,
      },
      {
        path: 'payment/verify',
        element: <VerifyPaymentPage />,
      },
      {
        path: paths.login,
        element: <LoginPage />,
      },
      {
        path: paths.register,
        element: <SignupPage />,
      },
      {
        path: 'faq',
        element: <Faq />,
      },
      {
        path: 'testimonials',
        element: <Testimonials />,
      },
      {
        path: 'job',
        element: <SingleJob />,
      },
      {
        path: 'job/postedjob/:jobId',
        element: <PostedJob />,
      },
      {
        path: paths.privacyPolicy,
        element: <PrivacyPolicy />,
      },
      {
        path: paths.termsConditions,
        element: <TermsAndCondition />,
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
            index: true,
            element: <TalentDashboardHome />,
          },
          {
            path: 'talentProfile',
            element: <TalentProfile />,
          },
          {
            path: 'talentQuiz',
            element: <PreAssessmentPage />,
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
            element: <Inbox />,
          },
          {
            path: 'Notification',
            element: <Notifications />,
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
          {
            path: 'notification',
            element: <RecruiterNotification />,
          },
          {
            path: 'chat',
            element: <Chat />,
          },
          {
            path: 'profile',
            element: <RecruiterProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: '/adminDashboard',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        path: '',
        element: <AdminProfileSidebar />,
        children: [
          {
            path: 'viewcandidates',
            element: <ViewCandidates />,
          },
          {
            path: 'roles',
            element: <AdminRoles />,
          },
        ],
      },
    ],
  },
]
