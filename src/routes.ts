import { lazy } from 'react'

const ExploreCampaigns = lazy(() => import('./views/Campaigns'))
const CampaignDetail = lazy(() => import('./views/Campaigns/CampaignDetail'))
const LaunchCampaign = lazy(() => import('./views/Campaigns/LaunchCampaign'))
const CreateToken = lazy(() => import('./views/Tokens/CreateToken'))
const ManageTokens = lazy(() => import('./views/Tokens/ManageTokens'))
const Locks = lazy(() => import('./views/Locks/Locks'))
const LockDetail = lazy(() => import('./views/Locks/LockDetail'))
const LockToken = lazy(() => import('./views/Locks/LockToken'))
// const Dashboard = lazy(() => import('./views/Dashboard'))
const userContribution = lazy(() => import('./views/userContribution/contributioncard'))
const KYC = lazy(() => import('./views/KYC'))
const PolicyPage = lazy(() => import('./components/Footer/privacy_Policy'))
const DisclaimerPage = lazy(() => import('./components/Footer/disclaimer'))

export interface IRoute {
  path: string
  name?: string
  icon?: string
  component: (props: any) => JSX.Element
  exact?: boolean
  redirect?: boolean
}

export const routes: IRoute[] = [
  {
    path: '/',
    exact: true,
    component: ExploreCampaigns,
  },
  {
    path: '/projects',
    name: 'EXPLORE PROJECTS',
    icon: 'tim-icons icon-chart-pie-36',
    component: ExploreCampaigns,
  },
  {
    path: '/project/:campaignId',
    component: CampaignDetail,
  },
  {
    path: '/launch-Project',
    name: 'LAUNCH YOUR PROJECT',
    icon: 'tim-icons icon-spaceship',
    component: LaunchCampaign,
  },

  {
    path: '/manage-tokens',
    name: 'Manage tokens',
    icon: 'tim-icons icon-money-coins',
    component: ManageTokens,
  },
  {
    path: '/create-token',
    name: 'Create Token',
    icon: 'tim-icons icon-coins',
    component: CreateToken,
  },

  {
    path: '/locks',
    name: 'Manage locks',
    icon: 'tim-icons icon-laptop',
    component: Locks,
  },
  {
    path: '/lock/:lockId',
    component: LockDetail,
  },
  {
    path: '/lock-token',
    name: 'Lock token',
    icon: 'tim-icons icon-lock-circle',
    component: LockToken,
  },

  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   icon: 'tim-icons icon-chart-bar-32',
  //   component: Dashboard,
  // },
  // {
  //   path: '/contributionDetail',
  //   name: 'History',
  //   icon: 'tim-icons icon-calendar-60',
  //   component: userContribution,
  // },
  {
    path: '/KYC',
    name: 'KYC',
    icon: 'tim-icons icon-chart-bar-32',
    component: KYC,
  },
  {
    path: '/Policy',
    component: PolicyPage,
  },
  {
    path: '/Disclaimer',
    component: DisclaimerPage,
  },
]
