import React, { lazy } from 'react'
import { RouteObject } from 'react-router-dom'

const ExploreCampaigns = lazy(() => import('./views/Campaigns'))
const CampaignDetail = lazy(() => import('./views/Campaigns/CampaignDetail'))
const LaunchCampaign = lazy(() => import('./views/Campaigns/LaunchCampaign'))
const CreateToken = lazy(() => import('./views/Tokens/CreateToken'))
const ManageTokens = lazy(() => import('./views/Tokens/ManageTokens'))
const Locks = lazy(() => import('./views/Locks/Locks'))
const LockDetail = lazy(() => import('./views/Locks/LockDetail'))
const LockToken = lazy(() => import('./views/Locks/LockToken'))
// const Dashboard = lazy(() => import('./views/Dashboard'))
const UserContribution = lazy(() => import('./views/userContribution/contributioncard'))
const KYC = lazy(() => import('./views/KYC'))
const PolicyPage = lazy(() => import('./components/Footer/privacy_Policy'))
const DisclaimerPage = lazy(() => import('./components/Footer/DisclaimerPage'))

const NotFound = lazy(() => import('./views/NotFound'))

export interface IRoute extends RouteObject {
  name?: string
  icon?: string
}

export const routes: IRoute[] = [
  {
    path: '/',
    element: <ExploreCampaigns />,
  },
  {
    path: '/projects',
    name: 'EXPLORE PROJECTS',
    icon: 'tim-icons icon-chart-pie-36',
    element: <ExploreCampaigns />,
  },
  {
    path: '/project/:campaignId',
    element: <CampaignDetail />,
  },
  {
    path: '/launch-Project',
    name: 'LAUNCH YOUR PROJECT',
    icon: 'tim-icons icon-spaceship',
    element: <LaunchCampaign />,
  },

  {
    path: '/manage-tokens',
    name: 'Manage tokens',
    icon: 'tim-icons icon-money-coins',
    element: <ManageTokens />,
  },
  {
    path: '/create-token',
    name: 'Create Token',
    icon: 'tim-icons icon-coins',
    element: <CreateToken />,
  },

  {
    path: '/locks',
    name: 'Manage locks',
    icon: 'tim-icons icon-laptop',
    element: <Locks />,
  },
  {
    path: '/lock/:lockId',
    element: <LockDetail />,
  },
  {
    path: '/lock-token',
    name: 'Lock token',
    icon: 'tim-icons icon-lock-circle',
    element: <LockToken />,
  },

  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: 'tim-icons icon-chart-bar-32',
  //   element: <Dashboard />,
  // },
  {
    path: '/contributionDetail',
    name: 'History',
    icon: 'tim-icons icon-calendar-60',
    element: <UserContribution />,
  },
  {
    path: '/KYC',
    name: 'KYC',
    icon: 'tim-icons icon-chart-bar-32',
    element: <KYC />,
  },
  {
    path: '/Policy',
    element: <PolicyPage />,
  },
  {
    path: '/Disclaimer',
    name: 'Disclaimer',
    icon: 'tim-icons icon-alert-circle-exc',
    element: <DisclaimerPage />,
  },

  {
    path: '*',
    element: <NotFound />,
  },
]
