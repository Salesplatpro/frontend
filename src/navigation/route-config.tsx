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
import RequireActiveCompany from '@/components/routing/RequireActiveCompany'
import RequireEmailVerified from '@/components/routing/RequireEmailVerified'
import ApplyWizardEntry from '@/features/apply-wizard/ApplyWizardEntry'
import ApplyWizardLayout from '@/features/apply-wizard/ApplyWizardLayout'
import ApplyStep from '@/features/apply-wizard/steps/ApplyStep'
import PrescreeningStep from '@/features/apply-wizard/steps/PrescreeningStep'
import ProfileStep from '@/features/apply-wizard/steps/ProfileStep'
import SignupStep from '@/features/apply-wizard/steps/SignupStep'
import VerifyStep from '@/features/apply-wizard/steps/VerifyStep'
import { LoginPage, SignupPage } from '@/features/auth/pages'
import AccountEmailVerification from '@/features/email-verification/pages/AccountEmailVerification'
import PreAssessmentPage from '@/features/pre-assessment/page'
import { LandingPage } from '@/LandingPage'
import PageNotFound from '@/PageNotFound'
import { MainLayout, Resources } from '@/pages'
import AdminProfileSidebar from '@/pages/AdminProfile/AdminProfileSidebar'
import Feedback from '@/pages/AdminProfile/Feedback/Feedback'
import Jobs from '@/pages/AdminProfile/Jobs/Jobs'
import OrganizationDetail from '@/pages/AdminProfile/Organizations/OrganizationDetail'
import Organizations from '@/pages/AdminProfile/Organizations/Organizations'
import Recruiters from '@/pages/AdminProfile/Recruiters/Recruiters'
import AdminRoles from '@/pages/AdminProfile/Roles/Roles'
import Talents from '@/pages/AdminProfile/Talents/Talents'
import ViewCandidates from '@/pages/AdminProfile/ViewCandidates/ViewCandidates'
import PostedJob from '@/pages/Home/Jobs/PostedJob'
import VerifyPaymentPage from '@/pages/Pricing/Verify'
import {
  ApplicationProgress,
  Chat,
  MyJobPosts,
  ProcessCV,
  Profile as RecruiterProfilePage,
  Shortlist,
  UploadCv,
} from '@/pages/RecruiterProfile'
import { ChooseMethod } from '@/pages/RecruiterProfile/Batching/ChooseMethod'
import CreateJD from '@/pages/RecruiterProfile/Batching/CreateJD'
import {
  MyScoutJobs,
  ScoutJobHistory,
} from '@/pages/RecruiterProfile/Batching/MyScoutJobs'
import Company from '@/pages/RecruiterProfile/Company/Company'
import CreateCompany from '@/pages/RecruiterProfile/Company/CreateCompany'
import EditCompany from '@/pages/RecruiterProfile/Company/EditCompany'
import AllApplications from '@/pages/RecruiterProfile/Dashboard/AllApplications'
import Dashboard from '@/pages/RecruiterProfile/Dashboard/Dashboard'
import { EditJobTab } from '@/pages/RecruiterProfile/EditJob'
import JobDetail from '@/pages/RecruiterProfile/JobDetail'
import { SingleJobPost } from '@/pages/RecruiterProfile/MyJobPosts/SingleJobPost'
import PostJobTab from '@/pages/RecruiterProfile/PostJobs/PostJobTab'
import RecruiterProfileSidebar from '@/pages/RecruiterProfile/RecruiterProfileSidebar'
import SearchResult from '@/pages/RecruiterProfile/TalentSearch/SearchResult'
import SearchTalent from '@/pages/RecruiterProfile/TalentSearch/SearchTalent'
import { ViewCvPage } from '@/pages/RecruiterProfile/ViewCv/ViewCvPage'
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

import { RootLayout } from './RootLayout'

export const routeConfig: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <PageNotFound />,
    children: [
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
            path: paths.verifyEmail,
            element: <AccountEmailVerification />,
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
        element: <ProtectedRoute allowedRoles={['recruiter', 'admin']} />,
        children: [
          {
            path: '/view-cv/:talentId',
            element: <ViewCvPage />,
          },
        ],
      },
      {
        path: '/apply/:jobId',
        element: <ApplyWizardLayout />,
        children: [
          {
            index: true,
            element: <ApplyWizardEntry />,
          },
          {
            path: 'signup',
            element: <SignupStep />,
          },
          {
            element: <ProtectedRoute allowedRoles={['talent']} />,
            children: [
              {
                path: 'verify',
                element: <VerifyStep />,
              },
              {
                path: 'profile',
                element: <ProfileStep />,
              },
              {
                path: 'prescreen',
                element: <PrescreeningStep />,
              },
              {
                path: 'details',
                element: <ApplyStep />,
              },
            ],
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
                element: <RequireEmailVerified redirectTo="/talentDashboard" />,
                children: [
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
        ],
      },
      {
        path: '/recruiterDashboard',
        element: <ProtectedRoute allowedRoles={['recruiter']} />,
        children: [
          {
            path: 'verify-email',
            element: <AccountEmailVerification />,
          },
          {
            path: '',
            element: <RecruiterProfileSidebar />,
            children: [
              {
                element: (
                  <RequireEmailVerified redirectTo="/recruiterDashboard/verify-email" />
                ),
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
                    path: 'company',
                    element: <Company />,
                  },
                  {
                    path: 'company/new',
                    element: <CreateCompany />,
                  },
                  {
                    path: 'company/:id/edit',
                    element: <EditCompany />,
                  },
                  {
                    element: <RequireActiveCompany />,
                    children: [
                      {
                        path: 'postjob',
                        element: <PostJobTab />,
                      },
                      {
                        path: 'postjob/:jobId',
                        element: <PostJobTab />,
                      },
                    ],
                  },
                  {
                    path: 'myJobPosts',
                    element: <MyJobPosts />,
                  },
                  {
                    path: 'scout',
                    element: <MyScoutJobs />,
                  },
                  {
                    path: 'scout/history/:scoutJobId',
                    element: <ScoutJobHistory />,
                  },
                  {
                    path: 'scout/:id',
                    element: <ChooseMethod />,
                  },
                  {
                    path: 'talent-search',
                    element: <SearchTalent />,
                  },
                  {
                    path: 'talent-search/results',
                    element: <SearchResult />,
                  },
                  {
                    path: 'scout/create-jd',
                    element: <CreateJD />,
                  },
                  {
                    path: 'scout/upload-cv/:id',
                    element: <UploadCv />,
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
                index: true,
                element: <Talents />,
              },
              {
                path: 'talents',
                element: <Talents />,
              },
              {
                path: 'recruiters',
                element: <Recruiters />,
              },
              {
                path: 'organizations',
                element: <Organizations />,
              },
              {
                path: 'organizations/:organizationId',
                element: <OrganizationDetail />,
              },
              {
                path: 'jobs',
                element: <Jobs />,
              },
              {
                path: 'viewcandidates',
                element: <ViewCandidates />,
              },
              {
                path: 'roles',
                element: <AdminRoles />,
              },
              {
                path: 'feedback',
                element: <Feedback />,
              },
            ],
          },
        ],
      },
    ],
  },
]
